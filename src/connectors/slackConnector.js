/**
 * Slack Connector
 * Real-time Slack integration for audit alerts, findings, and notifications
 */

import { WebClient } from "@slack/web-api";
import { createEventAdapter } from "@slack/events-api";

class SlackConnector {
  constructor() {
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.signingSecret = process.env.SLACK_SIGNING_SECRET;
    this.slackEventAdapter = createEventAdapter(this.signingSecret);
    this.isConnected = false;

    // Channel mapping
    this.channels = {
      audits: process.env.SLACK_AUDIT_CHANNEL || "#audits",
      findings: process.env.SLACK_FINDINGS_CHANNEL || "#findings",
      deployments: process.env.SLACK_DEPLOYMENTS_CHANNEL || "#deployments",
    };

    this.initialize();
  }

  /**
   * Initialize Slack connection and event listeners
   */
  async initialize() {
    try {
      // Test connection
      await this.client.auth.test();
      this.isConnected = true;
      console.log("✅ Slack connector initialized successfully");

      // Setup event listeners
      this.setupEventListeners();
    } catch (error) {
      console.error("❌ Failed to initialize Slack connector:", error);
      this.isConnected = false;
    }
  }

  /**
   * Setup Slack event listeners
   */
  setupEventListeners() {
    // Handle app mentions
    this.slackEventAdapter.on("app_mention", async (event) => {
      console.log("👤 Slack app mentioned:", event.text);
      // Could trigger specific audit actions based on mentions
    });

    // Handle reactions
    this.slackEventAdapter.on("reaction_added", async (event) => {
      console.log("👍 Reaction added:", event.reaction);
    });

    // Handle errors
    this.slackEventAdapter.on("error", (error) => {
      console.error("❌ Slack event error:", error);
    });
  }

  /**
   * Send alert to Slack
   */
  async sendAlert(message, severity = "info") {
    if (!this.isConnected) {
      console.warn("⚠️  Slack not connected, skipping alert");
      return false;
    }

    const color =
      severity === "critical"
        ? "#FF0000"
        : severity === "warning"
          ? "#FFA500"
          : "#00FF00";

    try {
      await this.client.chat.postMessage({
        channel: this.channels.audits,
        attachments: [
          {
            color: color,
            title: `⚠️  ${severity.toUpperCase()}`,
            text: message,
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      });

      console.log(`📤 Alert sent to Slack (#audits): ${message}`);
      return true;
    } catch (error) {
      console.error("❌ Failed to send Slack alert:", error);
      return false;
    }
  }

  /**
   * Send finding notification to Slack
   */
  async sendFinding(finding) {
    if (!this.isConnected) return false;

    const severity =
      finding.severity === "high"
        ? "🔴"
        : finding.severity === "medium"
          ? "🟡"
          : "🟢";

    try {
      const thread_ts = await this.client.chat.postMessage({
        channel: this.channels.findings,
        attachments: [
          {
            color:
              finding.severity === "high"
                ? "#FF0000"
                : finding.severity === "medium"
                  ? "#FFA500"
                  : "#00FF00",
            title: `${severity} ${finding.title}`,
            text: finding.description,
            fields: [
              {
                title: "Agent",
                value: finding.agentName,
                short: true,
              },
              {
                title: "Severity",
                value: finding.severity,
                short: true,
              },
              {
                title: "Category",
                value: finding.category,
                short: true,
              },
              {
                title: "Confidence",
                value: `${finding.confidence}%`,
                short: true,
              },
            ],
            footer: `Audit ID: ${finding.auditId}`,
            ts: Math.floor(Date.now() / 1000),
          },
        ],
      });

      // Send thread reply with action items if present
      if (finding.actionItems && finding.actionItems.length > 0) {
        await this.client.chat.postMessage({
          channel: this.channels.findings,
          thread_ts: thread_ts.ts,
          text: `📋 *Action Items:*\n${finding.actionItems
            .map((item) => `• ${item}`)
            .join("\n")}`,
        });
      }

      console.log(
        `📤 Finding sent to Slack (#findings): ${finding.title}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send Slack finding:", error);
      return false;
    }
  }

  /**
   * Send audit completion report to Slack
   */
  async sendAuditCompletion(auditReport) {
    if (!this.isConnected) return false;

    try {
      const status =
        auditReport.status === "passed"
          ? "✅ PASSED"
          : "❌ FAILED";
      const color =
        auditReport.status === "passed"
          ? "#00FF00"
          : "#FF0000";

      await this.client.chat.postMessage({
        channel: this.channels.audits,
        attachments: [
          {
            color: color,
            title: `${status} - Audit Completion Report`,
            text: `Audit *${auditReport.auditName}* has completed`,
            fields: [
              {
                title: "Start Time",
                value: new Date(
                  auditReport.startTime
                ).toLocaleString(),
                short: true,
              },
              {
                title: "End Time",
                value: new Date(auditReport.endTime).toLocaleString(),
                short: true,
              },
              {
                title: "Duration",
                value: auditReport.duration,
                short: true,
              },
              {
                title: "Total Findings",
                value: auditReport.findingCount.toString(),
                short: true,
              },
              {
                title: "Critical",
                value: auditReport.criticalCount.toString(),
                short: true,
              },
              {
                title: "Medium",
                value: auditReport.mediumCount.toString(),
                short: true,
              },
              {
                title: "Low",
                value: auditReport.lowCount.toString(),
                short: true,
              },
              {
                title: "Status",
                value: auditReport.status,
                short: true,
              },
            ],
            footer: `Audit Engine v1.0`,
            ts: Math.floor(Date.now() / 1000),
          },
        ],
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*View Full Report:* <${auditReport.reportUrl}|Click here>`,
            },
          },
        ],
      });

      console.log(
        `📤 Audit completion sent to Slack: ${auditReport.auditName}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send Slack completion report:", error);
      return false;
    }
  }

  /**
   * Send agent progress update
   */
  async sendAgentProgress(agentName, progress, task) {
    if (!this.isConnected) return false;

    try {
      const progressBar =
        "█".repeat(Math.floor(progress / 5)) +
        "░".repeat(20 - Math.floor(progress / 5));

      await this.client.chat.postMessage({
        channel: this.channels.audits,
        text: `Agent Progress: ${agentName}`,
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `🤖 *${agentName}*\n${progressBar} ${progress}%\n${task}`,
            },
          },
        ],
      });

      return true;
    } catch (error) {
      console.error("❌ Failed to send agent progress:", error);
      return false;
    }
  }

  /**
   * Handle Slack webhook
   */
  async handleWebhook(req, res) {
    try {
      await this.slackEventAdapter.requestListener(req, res);
    } catch (error) {
      console.error("❌ Slack webhook error:", error);
      res.status(500).send("Internal server error");
    }
  }

  /**
   * Subscribe to agent events and route to Slack
   */
  subscribeToAgentEvents(eventBus) {
    eventBus.on("agent:completed", async (event) => {
      const finding = {
        agentName: event.agent,
        title: `${event.agent} Completed`,
        description: event.result.summary || "Task completed successfully",
        severity: "info",
        category: "Agent Completion",
        confidence: 100,
        auditId: event.auditId,
        actionItems: event.result.actionItems || [],
      };

      await this.sendFinding(finding);
    });

    eventBus.on("agent:failed", async (event) => {
      await this.sendAlert(
        `❌ Agent ${event.agent} failed: ${event.error}`,
        "critical"
      );
    });

    eventBus.on("audit:completed", async (event) => {
      await this.sendAuditCompletion(event.report);
    });
  }

  /**
   * Get connector status
   */
  async getStatus() {
    return {
      name: "Slack",
      connected: this.isConnected,
      channels: this.channels,
      lastCheck: new Date(),
    };
  }
}

export default new SlackConnector();
