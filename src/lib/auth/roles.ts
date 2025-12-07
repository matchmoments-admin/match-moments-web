export enum DashboardRole {
  SUPER_ADMIN = 'super_admin',
  CEO = 'ceo',
  SALES = 'sales',
  MARKETING = 'marketing',
  OPERATIONS = 'operations',
  CUSTOMER_SUCCESS = 'customer_success',
  // External roles (future)
  TEAM_OWNER = 'team_owner',
  TEAM_MANAGER = 'team_manager',
  CREATOR = 'creator',
  SPONSOR = 'sponsor',
}

export interface Permission {
  resource: string;
  action: 'read' | 'write' | 'delete' | 'admin';
}

export const rolePermissions: Record<DashboardRole, Permission[]> = {
  [DashboardRole.SUPER_ADMIN]: [
    { resource: '*', action: 'admin' }, // Full access to everything
  ],

  [DashboardRole.CEO]: [
    { resource: 'overview', action: 'read' },
    { resource: 'revenue', action: 'read' },
    { resource: 'sales', action: 'read' },
    { resource: 'customers', action: 'read' },
    { resource: 'operations', action: 'read' },
    { resource: 'marketing', action: 'read' },
    { resource: 'womens-sports', action: 'read' },
    { resource: 'content', action: 'read' },
    { resource: 'settings', action: 'read' },
  ],

  [DashboardRole.SALES]: [
    { resource: 'overview', action: 'read' },
    { resource: 'revenue', action: 'read' },
    { resource: 'sales', action: 'write' },
    { resource: 'customers', action: 'write' },
    { resource: 'womens-sports', action: 'read' },
  ],

  [DashboardRole.MARKETING]: [
    { resource: 'overview', action: 'read' },
    { resource: 'revenue', action: 'read' },
    { resource: 'marketing', action: 'write' },
    { resource: 'customers', action: 'read' },
    { resource: 'womens-sports', action: 'read' },
    { resource: 'content', action: 'read' },
  ],

  [DashboardRole.OPERATIONS]: [
    { resource: 'overview', action: 'read' },
    { resource: 'operations', action: 'write' },
    { resource: 'content', action: 'write' },
    { resource: 'customers', action: 'read' },
  ],

  [DashboardRole.CUSTOMER_SUCCESS]: [
    { resource: 'overview', action: 'read' },
    { resource: 'customers', action: 'write' },
    { resource: 'content', action: 'read' },
  ],

  // External roles (future implementation)
  [DashboardRole.TEAM_OWNER]: [
    { resource: 'team-portal', action: 'admin' },
  ],

  [DashboardRole.TEAM_MANAGER]: [
    { resource: 'team-portal', action: 'write' },
  ],

  [DashboardRole.CREATOR]: [
    { resource: 'creator-tools', action: 'write' },
  ],

  [DashboardRole.SPONSOR]: [
    { resource: 'sponsor-portal', action: 'read' },
  ],
};

// Display names for roles
export const roleDisplayNames: Record<DashboardRole, string> = {
  [DashboardRole.SUPER_ADMIN]: 'Super Admin',
  [DashboardRole.CEO]: 'CEO',
  [DashboardRole.SALES]: 'Sales',
  [DashboardRole.MARKETING]: 'Marketing',
  [DashboardRole.OPERATIONS]: 'Operations',
  [DashboardRole.CUSTOMER_SUCCESS]: 'Customer Success',
  [DashboardRole.TEAM_OWNER]: 'Team Owner',
  [DashboardRole.TEAM_MANAGER]: 'Team Manager',
  [DashboardRole.CREATOR]: 'Creator',
  [DashboardRole.SPONSOR]: 'Sponsor',
};

