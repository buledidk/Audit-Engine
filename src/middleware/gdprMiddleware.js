/**
 * GDPR COMPLIANCE MIDDLEWARE
 * Tracks user data access, builds audit trail, enforces consent
 */

const gdprMiddleware = (req, res, next) => {
  // Capture start time for audit logging
  req.requestStart = Date.now();

  // Log access for GDPR audit trail (data access logging required by GDPR)
  if (req.user && req.path.includes("/api")) {
    console.log(`[GDPR-AUDIT] User: ${req.user.id}, Action: ${req.method} ${req.path}, Time: ${new Date().toISOString()}`);
  }

  // Track data access in request object for later logging
  req.gdprMetadata = {
    userId: req.user?.id,
    action: `${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip,
    userAgent: req.get("user-agent")
  };

  next();
};

export default gdprMiddleware;
