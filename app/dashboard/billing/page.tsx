'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import {
    Users,
    Package,
    ShieldCheck,
    CheckCircle2,
    CreditCard,
    Zap,
    Lock,
    Shield
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

export default function BillingPage() {
    const { company } = useAuth();
    const [workersCount, setWorkersCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);

    useEffect(() => {
        if (!company) return;
        const companyRefId = company.companyRefId;
        const unsubWorkers = onSnapshot(collection(db, `companies/${companyRefId}/workers`), (sh) => setWorkersCount(sh.size));
        const unsubInventory = onSnapshot(collection(db, `companies/${companyRefId}/inventory`), (sh) => setProductsCount(sh.size));
        return () => { unsubWorkers(); unsubInventory(); };
    }, [company]);

    const plans = [
        { id: 'starter', name: 'Starter Plan', price: 0, features: ['1 Staff Member', '20 Product Limit', 'Basic Analytics'], isCurrent: company?.subscriptionPlan === 'starter' },
        { id: 'standard', name: 'Standard Plan', price: 2000, features: ['2 Staff Members', '50 Product Limit', 'Export Tools', 'Low Stock Alerts'], isCurrent: company?.subscriptionPlan === 'standard', isPopular: true },
        { id: 'pro', name: 'Pro Plan', price: 5000, features: ['5 Staff Members', 'Unlimited Products', 'Advanced Reports', 'Priority Support'], isCurrent: company?.subscriptionPlan === 'pro' }
    ];

    const stats = [
        { label: 'Staff Slots Used', used: workersCount, limit: company?.staffLimit || (company?.subscriptionPlan === 'starter' ? 1 : company?.subscriptionPlan === 'standard' ? 2 : 5), icon: Users },
        { label: 'Inventory Capacity', used: productsCount, limit: company?.inventoryLimit || (company?.subscriptionPlan === 'starter' ? 20 : company?.subscriptionPlan === 'standard' ? 50 : -1), icon: Package },
    ];

    return (
        <div className="flex flex-col gap-8 md:gap-10 pb-20">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Subscription</h1>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 italic">
                        <Lock className="w-3.5 h-3.5 text-emerald-500" />
                        Current Plan: {company?.subscriptionPlan === 'pro' ? 'Professional' : company?.subscriptionPlan === 'standard' ? 'Standard' : 'Starter'}
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 w-full md:w-auto">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700">Billing Active</span>
                    </div>
                </div>
            </div>

            {/* USAGE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {stats.map(s => (
                    <div key={s.label} className="bg-card p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                            <s.icon className="w-12 h-12 md:w-16 md:h-16" />
                        </div>
                        <div className="relative space-y-4 md:space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                                    <s.icon className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <span className="text-[10px] md:text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</span>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                                    {s.used} <span className="text-sm font-medium text-muted-foreground">/ {s.limit < 0 ? 'Unlimited' : s.limit}</span>
                                </h3>
                                <div className="w-full h-1.5 md:h-2 bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: s.limit < 0 ? '100%' : `${Math.min(100, (s.used / s.limit) * 100)}%` }}
                                        className={cn("h-full", s.limit < 0 ? "bg-emerald-500" : (s.used >= s.limit ? "bg-red-500" : "bg-emerald-500"))}
                                    />
                                </div>
                                <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground/40 uppercase tracking-wider">{s.used >= s.limit ? "Limit reached" : "Account remaining healthy"}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PLANS */}
            <div className="space-y-8">
                <div className="text-center md:text-left space-y-1">
                    <h3 className="text-xl font-bold text-foreground">Change Subscription Plan</h3>
                    <p className="text-sm text-muted-foreground font-medium">Choose the best plan for your business scale</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((p) => (
                        <div key={p.id} className={cn(
                            "group p-8 border rounded-[2.5rem] transition-all relative flex flex-col shadow-sm",
                            p.isCurrent ? "border-emerald-500 bg-emerald-50/10 ring-4 ring-emerald-500/5 shadow-emerald-500/10" : "border-border hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
                        )}>
                            {p.isPopular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest bg-emerald-600 text-white px-4 py-1.5 rounded-full shadow-lg shadow-emerald-600/30">Most Popular</div>}
                            <div className="space-y-1 mb-8">
                                <h4 className="text-sm font-bold text-foreground">{p.name}</h4>
                                <p className="text-4xl font-bold tracking-tight text-foreground">{formatCurrency(p.price, company?.currency)}<span className="text-sm font-medium text-muted-foreground ml-1">/mo</span></p>
                            </div>
                            <div className="space-y-4 flex-1 mb-10">
                                {p.features.map(f => (
                                    <div key={f} className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500/40 shrink-0" />
                                        <span>{f}</span>
                                    </div>
                                ))}
                            </div>
                            <button className={cn(
                                "w-full py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
                                p.isCurrent ? "bg-emerald-100 text-emerald-700 cursor-default" : "bg-foreground text-background hover:scale-[1.02] active:scale-[0.98]"
                            )}>
                                {p.isCurrent ? 'Current Plan' : 'Select Plan'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* TRUST SECTION */}
            <div className="p-6 md:p-8 bg-emerald-900 text-white rounded-2xl md:rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-emerald-700 transition-colors" />
                <div className="flex items-center gap-4 md:gap-6 relative z-10 text-center md:text-left flex-col md:flex-row">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <Shield className="w-6 h-6 md:w-8 md:h-8 text-emerald-300" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-sm md:text-base font-bold">Secure Billing & Security</h4>
                        <p className="text-[10px] md:text-xs text-emerald-100/60 font-medium max-w-sm">We use bank-level encryption. Your payment info is never stored on our servers.</p>
                    </div>
                </div>
                <div className="text-center md:text-right relative z-10 shrink-0">
                    <p className="text-[9px] md:text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-1 opacity-60">Next Billing Date</p>
                    <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-white">Monthly Renewal</p>
                </div>
            </div>
        </div>
    );
}
