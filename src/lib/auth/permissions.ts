import { DashboardRole, rolePermissions, Permission } from './roles';

export function hasPermission(
  userRole: DashboardRole,
  resource: string,
  action: Permission['action']
): boolean {
  const permissions = rolePermissions[userRole];

  // Check for wildcard admin access
  if (permissions.some((p) => p.resource === '*' && p.action === 'admin')) {
    return true;
  }

  // Check for specific permission
  return permissions.some((p) => {
    const resourceMatch = p.resource === resource || p.resource === '*';
    const actionMatch =
      p.action === action ||
      p.action === 'admin' ||
      (action === 'read' && p.action === 'write');
    return resourceMatch && actionMatch;
  });
}

export function getAccessibleResources(userRole: DashboardRole): string[] {
  const permissions = rolePermissions[userRole];

  // If has wildcard, return all resources
  if (permissions.some((p) => p.resource === '*')) {
    return [
      'overview',
      'revenue',
      'sales',
      'customers',
      'operations',
      'marketing',
      'womens-sports',
      'content',
      'settings',
    ];
  }

  // Otherwise return specific resources
  return [...new Set(permissions.map((p) => p.resource))];
}

export function canAccessPage(userRole: DashboardRole, page: string): boolean {
  const resources = getAccessibleResources(userRole);
  return resources.includes(page);
}

export function canWrite(userRole: DashboardRole, resource: string): boolean {
  return hasPermission(userRole, resource, 'write') || hasPermission(userRole, resource, 'admin');
}

export function canDelete(userRole: DashboardRole, resource: string): boolean {
  return hasPermission(userRole, resource, 'delete') || hasPermission(userRole, resource, 'admin');
}

export function isAdmin(userRole: DashboardRole): boolean {
  return userRole === DashboardRole.SUPER_ADMIN;
}

