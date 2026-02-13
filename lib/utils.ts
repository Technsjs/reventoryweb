import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    }).format(amount);
};

export const formatDate = (timestamp: number | string | Date) => {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return 'N/A';
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    } catch {
        return 'N/A';
    }
};

export const getAuthErrorMessage = (error: any) => {
    if (!error?.code) return error?.message || 'Something went wrong. Please try again.';

    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try logging in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Your password is too weak. Use at least 6 characters.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please check and try again.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Please contact support.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        default:
            return 'Something happened. Please try again later.';
    }
};
