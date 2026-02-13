export interface Company {
    companyRefId: string;
    name: string;
    email: string;
    ownerUID: string;
    createdAt: number;
    updatedAt: number;
    logoUrl?: string;
    address?: string;
    phone?: string;
    description?: string;
    industry?: string;
    country?: string;
    subscriptionPlan: 'starter' | 'standard' | 'pro';
    subscriptionStartDate?: number;
    subscriptionEndDate?: number;
    currency: string;
    staffLimit: number;
    inventoryLimit: number;
    purchasedWorkerSlots: number;
    purchasedInventorySlots: number;
    lastPaymentDate: number;
    subscriptionStatus: 'active' | 'past_due' | 'canceled';
}

export interface Product {
    id: string;
    name: string;
    brand?: string;
    categoryId: string;
    brandId?: string;
    price: number;
    purchaseCost?: number;
    sku?: string;
    note?: string;
    quantity: number;
    lowStockAlert: number;
    searchTags: string[];
    createdAt: number; // Changed to number for consistency
    updatedAt: number;
    companyRefId: string;
    createdBy: string;
    isActive: boolean;
    isDeleted?: boolean;
    branchId?: string;
}

export interface Sale {
    id: string;
    productId: string;
    workerId: string;
    companyRefId: string;
    quantitySold: number;
    priceAtSale: number;
    purchaseCostAtSale: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: number;
    approved: boolean;
    approvedAt?: number;
    approvedBy?: string;
    rejectionReason?: string;
    notes?: string;
    imageUrl?: string;
    soldFor?: number;
    branchId?: string;
    isFromPendingCollection?: boolean;
}

export interface Worker {
    id: string;
    name: string;
    email: string;
    role?: string;
    branchId: string;
    isActive: boolean;
    createdAt: number;
    lastActive: number;
    phoneNumber?: string;
    phone?: string;
    initialPassword?: string;
}

export interface Brand {
    id: string;
    name: string;
    createdAt: number;
}

export interface Category {
    id: string;
    name: string;
    createdAt: number;
}

