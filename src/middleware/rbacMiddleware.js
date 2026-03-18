/**
 * RBAC - ROLE-BASED ACCESS CONTROL MIDDLEWARE
 * Validates user roles against required permissions for endpoints
 * Returns 403 Forbidden if user lacks required role
 */

const roleHierarchy = {
  admin: ["admin", "partner", "manager", "auditor", "viewer"],
  partner: ["partner", "manager", "auditor", "viewer"],
  manager: ["manager", "auditor", "viewer"],
  auditor: ["auditor", "viewer"],
  viewer: ["viewer"]
};

const rbacMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role || "viewer";
    const allowedRoles = roleHierarchy[userRole] || [];

    if (!allowedRoles.some((r) => requiredRoles.includes(r))) {
      return res.status(403).json({
        error: "Access denied",
        required_role: requiredRoles,
        user_role: userRole
      });
    }

    next();
  };
};

export default rbacMiddleware;
