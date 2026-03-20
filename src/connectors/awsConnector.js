/**
 * AWS Connector
 * S3 for file storage and CloudWatch for monitoring/logging
 */

import AWS from "aws-sdk";

class AWSConnector {
  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || "us-east-1",
    });

    this.s3 = new AWS.S3();
    this.cloudwatch = new AWS.CloudWatch();
    this.logs = new AWS.CloudWatchLogs();
    this.bucket = process.env.AWS_S3_BUCKET;
    this.namespace = process.env.AWS_CLOUDWATCH_NAMESPACE || "AuditEngine";
    this.logGroup =
      process.env.AWS_CLOUDWATCH_LOG_GROUP || "/aws/audit-engine";
    this.isConnected = false;

    this.initialize();
  }

  /**
   * Initialize AWS connection
   */
  async initialize() {
    try {
      // Test S3 connection
      await this.s3.headBucket({ Bucket: this.bucket }).promise();

      // Test CloudWatch connection
      await this.cloudwatch
        .describeAlarms({ MaxRecords: 1 })
        .promise();

      this.isConnected = true;
      console.log(
        `✅ AWS connector initialized (S3: ${this.bucket}, CW: ${this.namespace})`
      );
    } catch (error) {
      console.error("❌ Failed to initialize AWS connector:", error);
      this.isConnected = false;
    }
  }

  /**
   * Upload audit file to S3
   */
  async uploadAuditFile(file, auditId) {
    if (!this.isConnected) {
      console.warn("⚠️  AWS not connected");
      return null;
    }

    const key = `audits/${auditId}/${file.originalname}`;

    try {
      const params = {
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        Metadata: {
          "audit-id": auditId,
          "uploaded-at": new Date().toISOString(),
        },
      };

      const result = await this.s3.upload(params).promise();

      console.log(
        `📤 File uploaded to S3: s3://${this.bucket}/${key}`
      );

      return {
        bucket: this.bucket,
        key: key,
        location: result.Location,
        size: file.size,
        uploadedAt: new Date(),
      };
    } catch (error) {
      console.error("❌ Failed to upload file to S3:", error);
      return null;
    }
  }

  /**
   * Download audit file from S3
   */
  async downloadAuditFile(s3Key) {
    if (!this.isConnected) return null;

    try {
      const params = {
        Bucket: this.bucket,
        Key: s3Key,
      };

      const result = await this.s3.getObject(params).promise();

      console.log(`📥 File downloaded from S3: ${s3Key}`);

      return {
        body: result.Body,
        contentType: result.ContentType,
        size: result.ContentLength,
      };
    } catch (error) {
      console.error("❌ Failed to download file from S3:", error);
      return null;
    }
  }

  /**
   * Store complete audit report
   */
  async storeAuditReport(report) {
    if (!this.isConnected) return null;

    const key = `audit-reports/${report.auditId}/report-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    try {
      const params = {
        Bucket: this.bucket,
        Key: key,
        Body: JSON.stringify(report, null, 2),
        ContentType: "application/json",
        Metadata: {
          "audit-id": report.auditId,
          "audit-name": report.auditName,
          "report-type": "full-report",
        },
      };

      const result = await this.s3.upload(params).promise();

      console.log(
        `📤 Audit report stored: s3://${this.bucket}/${key}`
      );

      return {
        bucket: this.bucket,
        key: key,
        location: result.Location,
      };
    } catch (error) {
      console.error("❌ Failed to store audit report:", error);
      return null;
    }
  }

  /**
   * Send metric to CloudWatch
   */
  async sendMetric(metricName, value, unit = "Count") {
    if (!this.isConnected) return false;

    try {
      const params = {
        Namespace: this.namespace,
        MetricData: [
          {
            MetricName: metricName,
            Value: value,
            Unit: unit,
            Timestamp: new Date(),
          },
        ],
      };

      await this.cloudwatch.putMetricData(params).promise();

      console.log(
        `📊 Metric sent to CloudWatch: ${metricName} = ${value} ${unit}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send metric:", error);
      return false;
    }
  }

  /**
   * Log to CloudWatch
   */
  async logToCloudWatch(message, level = "INFO") {
    if (!this.isConnected) return false;

    const logStream = `audit-engine-${new Date().toISOString().slice(0, 10)}`;

    try {
      // Create log stream if not exists
      try {
        await this.logs
          .createLogStream({
            logGroupName: this.logGroup,
            logStreamName: logStream,
          })
          .promise();
      } catch (error) {
        if (error.code !== "ResourceAlreadyExistsException") {
          throw error;
        }
      }

      // Put log events
      await this.logs
        .putLogEvents({
          logGroupName: this.logGroup,
          logStreamName: logStream,
          logEvents: [
            {
              message: `[${level}] ${message}`,
              timestamp: Date.now(),
            },
          ],
        })
        .promise();

      console.log(`📝 Logged to CloudWatch: ${message}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to log to CloudWatch:", error);
      return false;
    }
  }

  /**
   * Create CloudWatch alarm for high error rate
   */
  async createErrorAlarm(threshold = 5) {
    if (!this.isConnected) return false;

    try {
      const params = {
        AlarmName: `${this.namespace}-HighErrorRate`,
        ComparisonOperator: "GreaterThanOrEqualToThreshold",
        EvaluationPeriods: 1,
        MetricName: "ErrorCount",
        Namespace: this.namespace,
        Period: 300, // 5 minutes
        Statistic: "Sum",
        Threshold: threshold,
        ActionsEnabled: true,
        AlarmActions: [
          `arn:aws:sns:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:alert-topic`,
        ],
        AlarmDescription: "Alert on high audit engine error rate",
      };

      await this.cloudwatch.putMetricAlarm(params).promise();

      console.log(
        `🚨 CloudWatch alarm created: ${params.AlarmName}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to create alarm:", error);
      return false;
    }
  }

  /**
   * Record agent execution metrics
   */
  async recordAgentExecution(
    agentName,
    success,
    duration,
    tokensUsed
  ) {
    if (!this.isConnected) return false;

    try {
      // Send execution count metric
      await this.sendMetric(
        `${agentName}-Executions`,
        1,
        "Count"
      );

      // Send duration metric
      await this.sendMetric(
        `${agentName}-Duration`,
        duration,
        "Milliseconds"
      );

      // Send tokens metric
      await this.sendMetric(
        `${agentName}-TokensUsed`,
        tokensUsed,
        "Count"
      );

      // Send success metric
      if (success) {
        await this.sendMetric(`${agentName}-Success`, 1, "Count");
      } else {
        await this.sendMetric(`${agentName}-Errors`, 1, "Count");
      }

      return true;
    } catch (error) {
      console.error("❌ Failed to record agent execution:", error);
      return false;
    }
  }

  /**
   * Get S3 files for audit
   */
  async listAuditFiles(auditId) {
    if (!this.isConnected) return null;

    try {
      const params = {
        Bucket: this.bucket,
        Prefix: `audits/${auditId}/`,
      };

      const result = await this.s3.listObjectsV2(params).promise();

      const files = (result.Contents || []).map((item) => ({
        key: item.Key,
        size: item.Size,
        lastModified: item.LastModified,
        uploadUrl: `https://${this.bucket}.s3.amazonaws.com/${item.Key}`,
      }));

      console.log(`📂 Listed ${files.length} files for audit ${auditId}`);
      return files;
    } catch (error) {
      console.error("❌ Failed to list audit files:", error);
      return null;
    }
  }

  /**
   * Get connector status
   */
  async getStatus() {
    return {
      name: "AWS",
      connected: this.isConnected,
      s3Bucket: this.bucket,
      region: process.env.AWS_REGION,
      namespace: this.namespace,
      lastCheck: new Date(),
    };
  }
}

export default new AWSConnector();
