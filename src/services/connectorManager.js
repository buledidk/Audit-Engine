/**
 * Connector Manager
 * Unified management of all external connectors
 * Routes events to appropriate connectors with health monitoring
 */

import slackConnector from "../connectors/slackConnector.js";
import githubConnector from "../connectors/githubConnector.js";
import emailConnector from "../connectors/emailConnector.js";
import awsConnector from "../connectors/awsConnector.js";

class ConnectorManager {
  constructor() {
    this.connectors = {
      slack: slackConnector,
      github: githubConnector,
      email: emailConnector,
      aws: awsConnector,
    };

    this.connectorStatus = {};
    this.eventLog = [];
  }

  /**
   * Initialize all connectors with health checks
   */
  async initializeConnectors() {
    console.log("🔌 Initializing all connectors...");

    for (const [name, connector] of Object.entries(this.connectors)) {
      try {
        const status = await connector.getStatus();
        this.connectorStatus[name] = {
          ...status,
          lastCheck: new Date(),
          healthy: status.connected,
        };

        if (status.connected) {
          console.log(`✅ ${name} connector initialized`);
        } else {
          console.warn(`⚠️  ${name} connector offline`);
        }
      } catch (error) {
        console.error(
          `❌ Failed to initialize ${name} connector:`,
          error
        );
        this.connectorStatus[name] = {
          healthy: false,
          error: error.message,
        };
      }
    }
  }

  /**
   * Route agent finding to all enabled connectors
   */
  async routeFinding(finding) {
    console.log(
      `📤 Routing finding: ${finding.title}`
    );

    const results = {};

    // Send to Slack
    if (this.connectorStatus.slack?.healthy) {
      results.slack = await this.connectors.slack.sendFinding(
        finding
      );
    }

    // Create GitHub issue
    if (this.connectorStatus.github?.healthy) {
      results.github =
        await this.connectors.github.createIssueFromFinding(finding);
    }

    // Send email notification if recipients provided
    if (this.connectorStatus.email?.healthy && finding.emailRecipients) {
      results.email =
        await this.connectors.email.sendFindingNotification(
          finding.emailRecipients,
          finding
        );
    }

    // Store in AWS S3
    if (this.connectorStatus.aws?.healthy) {
      results.aws = await this.connectors.aws.logToCloudWatch(
        `Finding: ${finding.title} (${finding.severity})`
      );
    }

    this.logEvent("finding-routed", finding, results);
    return results;
  }

  /**
   * Route audit completion to all connectors
   */
  async routeAuditCompletion(report) {
    console.log(`📤 Routing audit completion: ${report.auditName}`);

    const results = {};

    // Send to Slack
    if (this.connectorStatus.slack?.healthy) {
      results.slack =
        await this.connectors.slack.sendAuditCompletion(report);
    }

    // Create GitHub PR
    if (this.connectorStatus.github?.healthy) {
      results.github =
        await this.connectors.github.createPRFromAuditReport(report);
    }

    // Send email report
    if (this.connectorStatus.email?.healthy && report.emailRecipients) {
      for (const email of report.emailRecipients) {
        results.email =
          await this.connectors.email.sendCompletionReport(
            email,
            report
          );
      }
    }

    // Store in AWS S3
    if (this.connectorStatus.aws?.healthy) {
      results.aws = await this.connectors.aws.storeAuditReport(report);
    }

    this.logEvent("audit-completed", report, results);
    return results;
  }

  /**
   * Route agent execution metrics
   */
  async routeAgentMetrics(agentName, metrics) {
    if (this.connectorStatus.aws?.healthy) {
      await this.connectors.aws.recordAgentExecution(
        agentName,
        metrics.success,
        metrics.duration,
        metrics.tokensUsed
      );
    }

    // Log to Slack for high-priority agents
    if (metrics.success === false && this.connectorStatus.slack?.healthy) {
      await this.connectors.slack.sendAlert(
        `❌ Agent ${agentName} failed: ${metrics.error}`,
        "warning"
      );
    }
  }

  /**
   * Send alert across connectors
   */
  async broadcastAlert(message, severity = "info") {
    console.log(
      `🚨 Broadcasting alert (${severity}): ${message}`
    );

    const results = {};

    // Send to Slack
    if (this.connectorStatus.slack?.healthy) {
      results.slack =
        await this.connectors.slack.sendAlert(message, severity);
    }

    // Send email
    if (this.connectorStatus.email?.healthy) {
      results.email =
        await this.connectors.email.sendCompletionReport(
          process.env.ADMIN_EMAIL,
          {
            auditName: "System Alert",
            summary: message,
            status: "alert",
          }
        );
    }

    // Log to CloudWatch
    if (this.connectorStatus.aws?.healthy) {
      results.aws = await this.connectors.aws.logToCloudWatch(
        message,
        severity.toUpperCase()
      );
    }

    return results;
  }

  /**
   * Get all connector statuses
   */
  getConnectorStatuses() {
    return this.connectorStatus;
  }

  /**
   * Get health summary
   */
  getHealthSummary() {
    const statuses = Object.values(this.connectorStatus);
    const healthy = statuses.filter((s) => s.healthy).length;
    const total = statuses.length;

    return {
      healthy: healthy === total,
      summary: `${healthy}/${total} connectors online`,
      connectors: this.connectorStatus,
    };
  }

  /**
   * Log event for audit trail
   */
  logEvent(eventType, data, results) {
    this.eventLog.push({
      timestamp: new Date(),
      eventType,
      dataId: data.auditId || data.id,
      dataName: data.auditName || data.title,
      results,
    });

    // Keep last 1000 events
    if (this.eventLog.length > 1000) {
      this.eventLog = this.eventLog.slice(-1000);
    }
  }

  /**
   * Get event log
   */
  getEventLog(limit = 100) {
    return this.eventLog.slice(-limit);
  }

  /**
   * Subscribe to agent events and auto-route
   */
  subscribeToAgentEvents(eventBus) {
    eventBus.on("finding:identified", async (finding) => {
      await this.routeFinding(finding);
    });

    eventBus.on("audit:completed", async (report) => {
      await this.routeAuditCompletion(report);
    });

    eventBus.on("agent:metrics", async (metrics) => {
      await this.routeAgentMetrics(metrics.agentName, metrics);
    });

    eventBus.on("system:alert", async (alert) => {
      await this.broadcastAlert(alert.message, alert.severity);
    });
  }

  /**
   * Periodic health check
   */
  async startHealthCheck(intervalMs = 60000) {
    console.log(
      `🏥 Starting connector health checks (every ${intervalMs}ms)`
    );

    this.healthCheckInterval = setInterval(async () => {
      for (const [name, connector] of Object.entries(this.connectors)) {
        try {
          const status = await connector.getStatus();
          this.connectorStatus[name] = {
            ...status,
            lastCheck: new Date(),
            healthy: status.connected,
          };

          if (status.connected && !this.connectorStatus[name].healthy) {
            console.log(
              `✅ ${name} connector recovered`
            );
          } else if (!status.connected && this.connectorStatus[name].healthy) {
            console.warn(
              `⚠️  ${name} connector went offline`
            );
          }
        } catch (error) {
          console.error(
            `❌ Health check failed for ${name}:`,
            error.message
          );
          this.connectorStatus[name] = {
            healthy: false,
            error: error.message,
            lastCheck: new Date(),
          };
        }
      }
    }, intervalMs);
  }

  /**
   * Stop health check
   */
  stopHealthCheck() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }

  /**
   * Cleanup
   */
  destroy() {
    this.stopHealthCheck();
  }
}

export default new ConnectorManager();
