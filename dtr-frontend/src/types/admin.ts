export type ApprovalActionsRequest = {
    adminRemarks?: string;
}

export type AdminUser = {
    id: number;
    username: string;
    fullName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}