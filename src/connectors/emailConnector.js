/**
 * Email Connector
 * Send completion reports, reminders, and notifications via email
 * Supports both SendGrid and SMTP
 */

import nodemailer from "nodemailer";
import sgMail from "@sendgrid/mail";

class EmailConnector {
  constructor() {
    this.provider = process.env.SMTP_PROVIDER || "sendgrid";
    this.isConnected = false;

    this.fromEmail =
      process.env.SENDGRID_FROM_EMAIL ||
      process.env.SMTP_FROM_EMAIL ||
      "noreply@auditengine.com";
    this.fromName =
      process.env.SENDGRID_FROM_NAME ||
      process.env.SMTP_FROM_NAME ||
      "Audit Engine";

    this.initialize();
  }

  /**
   * Initialize email connector
   */
  async initialize() {
    try {
      if (this.provider === "sendgrid") {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.isConnected = true;
        console.log("✅ Email connector initialized (SendGrid)");
      } else if (this.provider === "smtp") {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT) || 587,
          secure: (process.env.SMTP_PORT) === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });

        // Verify connection
        await this.transporter.verify();
        this.isConnected = true;
        console.log("✅ Email connector initialized (SMTP)");
      }
    } catch (error) {
      console.error("❌ Failed to initialize email connector:", error);
      this.isConnected = false;
    }
  }

  /**
   * Send completion report via email
   */
  async sendCompletionReport(email, report) {
    if (!this.isConnected) {
      console.warn("⚠️  Email not connected");
      return false;
    }

    const htmlContent = this.generateReportHTML(report);

    const mailOptions = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: email,
      subject: `Audit Report: ${report.auditName} - ${report.status.toUpperCase()}`,
      html: htmlContent,
      attachments: report.attachments || [],
    };

    try {
      if (this.provider === "sendgrid") {
        await sgMail.send(mailOptions);
      } else {
        await this.transporter.sendMail(mailOptions);
      }

      console.log(
        `📤 Completion report sent to: ${email}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send completion report:", error);
      return false;
    }
  }

  /**
   * Send deadline reminder
   */
  async sendDeadlineReminder(email, auditName, dueDate) {
    if (!this.isConnected) return false;

    const daysUntil = Math.ceil(
      (dueDate - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const subject =
      daysUntil <= 0
        ? `URGENT: ${auditName} audit is overdue!`
        : `Reminder: ${auditName} audit due in ${daysUntil} days`;

    const htmlContent = `
      <h2>${subject}</h2>
      <p>Hello,</p>
      <p>This is a reminder that the <strong>${auditName}</strong> audit is due on <strong>${dueDate.toLocaleDateString()}</strong>.</p>
      ${daysUntil <= 0 ? "<p style='color: red;'><strong>⚠️  This audit is now overdue!</strong></p>" : ""}
      <p>Please log in to the Audit Engine to continue or complete the audit.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}/audits/${auditName}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Audit
        </a>
      </p>
      <p>Thank you</p>
    `;

    const mailOptions = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    try {
      if (this.provider === "sendgrid") {
        await sgMail.send(mailOptions);
      } else {
        await this.transporter.sendMail(mailOptions);
      }

      console.log(
        `📤 Deadline reminder sent to: ${email}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send reminder:", error);
      return false;
    }
  }

  /**
   * Send approval request
   */
  async sendApprovalRequest(
    email,
    itemName,
    itemDescription,
    actionUrl,
    deadline
  ) {
    if (!this.isConnected) return false;

    const htmlContent = `
      <h2>Approval Request</h2>
      <p>Hello,</p>
      <p>An approval is required for the following item:</p>
      <h3>${itemName}</h3>
      <p>${itemDescription}</p>
      <p>Please approve or reject by <strong>${deadline.toLocaleDateString()}</strong>.</p>
      <p>
        <a href="${actionUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 10px;">
          Review & Approve
        </a>
      </p>
      <p>Thank you</p>
    `;

    const mailOptions = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: email,
      subject: `Approval Required: ${itemName}`,
      html: htmlContent,
    };

    try {
      if (this.provider === "sendgrid") {
        await sgMail.send(mailOptions);
      } else {
        await this.transporter.sendMail(mailOptions);
      }

      console.log(
        `📤 Approval request sent to: ${email}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send approval request:", error);
      return false;
    }
  }

  /**
   * Send finding notification
   */
  async sendFindingNotification(emails, finding) {
    if (!this.isConnected) return false;

    const severityColor =
      finding.severity === "high"
        ? "#FF0000"
        : finding.severity === "medium"
          ? "#FFA500"
          : "#00FF00";

    const htmlContent = `
      <h2 style="color: ${severityColor};">🔍 Audit Finding</h2>
      <p><strong>Title:</strong> ${finding.title}</p>
      <p><strong>Agent:</strong> ${finding.agentName}</p>
      <p><strong>Severity:</strong> <span style="color: ${severityColor};">${finding.severity.toUpperCase()}</span></p>
      <p><strong>Category:</strong> ${finding.category}</p>
      <p><strong>Confidence:</strong> ${finding.confidence}%</p>
      <h3>Description</h3>
      <p>${finding.description}</p>
      <h3>Recommendation</h3>
      <p>${finding.recommendation}</p>
      ${
        finding.actionItems
          ? `
        <h3>Action Items</h3>
        <ul>
          ${finding.actionItems.map((item) => `<li>${item}</li>`).join("")}
        </ul>
      `
          : ""
      }
      <p>
        <a href="${process.env.FRONTEND_URL}/findings/${finding.findingId}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          View Details
        </a>
      </p>
    `;

    const mailOptions = {
      from: `${this.fromName} <${this.fromEmail}>`,
      to: emails.join(","),
      subject: `[${finding.severity.toUpperCase()}] ${finding.title}`,
      html: htmlContent,
    };

    try {
      if (this.provider === "sendgrid") {
        await sgMail.send(mailOptions);
      } else {
        await this.transporter.sendMail(mailOptions);
      }

      console.log(
        `📤 Finding notification sent to: ${emails.join(", ")}`
      );
      return true;
    } catch (error) {
      console.error("❌ Failed to send finding notification:", error);
      return false;
    }
  }

  /**
   * Generate HTML report
   */
  generateReportHTML(report) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { color: #333; }
          .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
          .finding { border-left: 4px solid #FF0000; padding: 10px; margin: 10px 0; }
          .finding.medium { border-left-color: #FFA500; }
          .finding.low { border-left-color: #00FF00; }
          .status { font-size: 24px; font-weight: bold; }
          .status.passed { color: #00FF00; }
          .status.failed { color: #FF0000; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Audit Report: ${report.auditName}</h1>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p class="status ${report.status}">${report.status.toUpperCase()}</p>
        </div>

        <h2>Summary</h2>
        <p>${report.summary}</p>

        <h2>Findings</h2>
        ${report.findings
          .map(
            (finding) => `
          <div class="finding ${finding.severity}">
            <h3>${finding.title}</h3>
            <p><strong>Severity:</strong> ${finding.severity}</p>
            <p><strong>Category:</strong> ${finding.category}</p>
            <p>${finding.description}</p>
            <p><strong>Recommendation:</strong> ${finding.recommendation}</p>
          </div>
        `
          )
          .join("")}

        <h2>Statistics</h2>
        <ul>
          <li>Total Findings: ${report.totalFindings}</li>
          <li>Critical: ${report.criticalCount}</li>
          <li>Medium: ${report.mediumCount}</li>
          <li>Low: ${report.lowCount}</li>
        </ul>

        <p style="margin-top: 40px; border-top: 1px solid #ccc; padding-top: 20px; color: #666;">
          <em>This report was generated by Audit Engine.</em>
        </p>
      </body>
      </html>
    `;
  }

  /**
   * Get connector status
   */
  async getStatus() {
    return {
      name: "Email",
      connected: this.isConnected,
      provider: this.provider,
      fromEmail: this.fromEmail,
      lastCheck: new Date(),
    };
  }
}

export default new EmailConnector();
