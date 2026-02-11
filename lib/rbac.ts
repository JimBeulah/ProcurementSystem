export type UserRole =
    | 'ADMIN'
    | 'ENCODER'
    | 'PURCHASER'
    | 'APPROVER'
    | 'CASH_DISBURSEMENT'
    | 'WAREHOUSE'
    | 'SITE_ENGINEER';

export interface RoutePermission {
    path: string;
    allowedRoles: UserRole[];
}

export const MODULE_PERMISSIONS: Record<string, UserRole[]> = {
    // Dashboard
    'dashboard': ['ADMIN', 'ENCODER', 'PURCHASER', 'APPROVER', 'CASH_DISBURSEMENT', 'WAREHOUSE', 'SITE_ENGINEER'],

    // Procurement
    'clients': ['ADMIN', 'ENCODER', 'PURCHASER', 'APPROVER', 'CASH_DISBURSEMENT'],
    'projects': ['ADMIN', 'ENCODER', 'PURCHASER', 'APPROVER', 'CASH_DISBURSEMENT', 'SITE_ENGINEER'],
    'rfq': ['ADMIN', 'PURCHASER', 'APPROVER'],
    'requests': ['ADMIN', 'ENCODER', 'SITE_ENGINEER', 'PURCHASER', 'APPROVER'],
    'orders': ['ADMIN', 'PURCHASER', 'APPROVER'],
    'receiving-goods': ['ADMIN', 'WAREHOUSE', 'PURCHASER'],
    'approvals': ['ADMIN', 'APPROVER'],

    // Operations
    'inventory': ['ADMIN', 'WAREHOUSE', 'ENCODER', 'SITE_ENGINEER'],
    'receiving': ['ADMIN', 'WAREHOUSE', 'PURCHASER'],
    'site-release': ['ADMIN', 'WAREHOUSE', 'SITE_ENGINEER'],

    // Finance
    'invoices': ['ADMIN', 'CASH_DISBURSEMENT', 'APPROVER'],
    'disbursements': ['ADMIN', 'CASH_DISBURSEMENT'],
    'reports': ['ADMIN', 'CASH_DISBURSEMENT', 'APPROVER', 'SITE_ENGINEER'],
};

export function hasAccess(role: string | undefined, moduleKey: string): boolean {
    if (!role) return false;
    const allowed = MODULE_PERMISSIONS[moduleKey];
    if (!allowed) return true; // Default to true if module not defined in matrix (or handle safely)
    return allowed.includes(role as UserRole);
}

export function canEdit(role: string | undefined, moduleKey: string): boolean {
    if (role === 'ADMIN') return true;

    const editPermissions: Record<string, UserRole[]> = {
        'projects': ['ENCODER'],
        'requests': ['SITE_ENGINEER', 'ENCODER'],
        'inventory': ['WAREHOUSE', 'ENCODER'],
        'disbursements': ['CASH_DISBURSEMENT'],
    };

    const allowed = editPermissions[moduleKey];
    if (!allowed) return false;
    return allowed.includes(role as UserRole);
}

export function getModuleFromPath(path: string): string | null {
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/clients')) return 'clients';
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/purchasing/rfq')) return 'rfq';
    if (path.startsWith('/purchasing/requests')) return 'requests';
    if (path.startsWith('/purchasing/orders')) return 'orders';
    if (path.startsWith('/inventory/receiving')) return 'receiving-goods';
    if (path.startsWith('/purchasing/approvals')) return 'approvals';
    if (path.startsWith('/inventory')) return 'inventory';
    if (path.startsWith('/receiving')) return 'receiving';
    if (path.startsWith('/site-release')) return 'site-release';
    if (path.startsWith('/finance/invoices')) return 'invoices';
    if (path.startsWith('/finance/disbursements')) return 'disbursements';
    if (path.startsWith('/finance/reports')) return 'reports';
    return null;
}
