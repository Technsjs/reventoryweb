'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Package,
    ShoppingCart,
    AlertTriangle,
    Clock,
    Plus,
    Users,
    ChevronRight,
    Search,
    Wallet,
    Target,
    Activity,
    ArrowUpRight,
    Layers,
    ArrowRight,
    Star,
    BarChart3,
    Percent,
    Menu,
    X
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { Product, Sale, Worker } from '@/lib/types';
import { AddProductDialog } from '@/components/add-product-dialog';

export default function MerchantDashboard() {
    const { company, loading: authLoading } = useAuth();
    const [data, setData] = useState<{
        products: Product[];
        sales: Sale[];
        workers: Worker[];
    }>({
        products: [],
        sales: [],
        workers: []
    });

    const [loading, setLoading] = useState(true);
    const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d' | '6m' | 'all'>('7d');
    const [showAddDialog, setShowAddDialog] = useState(false);

    const normalize = (d: any) => {
        const data = d.data();
        return {
            ...data,
            id: d.id,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (typeof data.createdAt === 'number' ? data.createdAt : 0),
        };
    };

    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [brandMap, setBrandMap] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!company) return;
        setLoading(true);
        setData({ products: [], sales: [], workers: [] }); // Reset state for new company
        const companyRefId = company.companyRefId;

        const unsubInventory = onSnapshot(collection(db, `companies/${companyRefId}/inventory`), (s) => {
            setData(prev => ({ ...prev, products: s.docs.map(d => normalize(d) as Product) }));
        });

        const unsubSales = onSnapshot(collection(db, `companies/${companyRefId}/sales_log`), (s) => {
            const logData = s.docs.map(d => ({ ...normalize(d), status: 'approved', approved: true, isFromPendingCollection: false }) as Sale);
            setData(prev => {
                const combined = [...logData, ...prev.sales.filter(s => s.isFromPendingCollection)];
                return { ...prev, sales: Array.from(new Map(combined.map(item => [item.id, item])).values()) };
            });
        });

        const unsubPending = onSnapshot(collection(db, `companies/${companyRefId}/pending_sales`), (s) => {
            const pendingData = s.docs.map(d => {
                const doc = normalize(d);
                return { ...doc, status: doc.approved ? 'approved' : 'pending', approved: !!doc.approved, isFromPendingCollection: true } as Sale;
            });
            setData(prev => {
                const combined = [...prev.sales.filter(s => !s.isFromPendingCollection), ...pendingData];
                return { ...prev, sales: Array.from(new Map(combined.map(item => [item.id, item])).values()) };
            });
        });

        const unsubWorkers = onSnapshot(collection(db, `companies/${companyRefId}/workers`), (s) => {
            setData(prev => ({ ...prev, workers: s.docs.map(d => normalize(d) as Worker) }));
            setLoading(false);
        });

        const unsubCats = onSnapshot(collection(db, `companies/${companyRefId}/categories`), (snapshot) => {
            const map: Record<string, string> = {};
            snapshot.docs.forEach(d => { map[d.id] = d.data().name; });
            setCategoryMap(map);
        });

        const unsubBrands = onSnapshot(collection(db, `companies/${companyRefId}/brands`), (snapshot) => {
            const map: Record<string, string> = {};
            snapshot.docs.forEach(d => { map[d.id] = d.data().name; });
            setBrandMap(map);
        });

        return () => { unsubInventory(); unsubSales(); unsubPending(); unsubWorkers(); unsubCats(); unsubBrands(); }
    }, [company]);

    const stats = useMemo(() => {
        const now = Date.now();
        let filterMs = now; // Default for 'all'
        if (timeFilter === '24h') filterMs = 86400000;
        else if (timeFilter === '7d') filterMs = 604800000;
        else if (timeFilter === '30d') filterMs = 2592000000; // 30 days
        else if (timeFilter === '6m') filterMs = 15552000000; // 180 days

        const cutoff = timeFilter === 'all' ? 0 : now - filterMs;

        // CRUCIAL: Only count sales_log entries for revenue/profit to match Analytics
        const approvedSales = data.sales.filter(s => !s.isFromPendingCollection && s.createdAt >= cutoff);
        const pending = data.sales.filter(s => s.isFromPendingCollection && s.status === 'pending');

        const revenue = approvedSales.reduce((acc, s) => {
            const unitPrice = s.soldFor || s.priceAtSale;
            const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
            return acc + lineTotal;
        }, 0);

        const items = approvedSales.reduce((acc, s) => acc + s.quantitySold, 0);

        const profit = approvedSales.reduce((acc, s) => {
            const unitPrice = s.soldFor || s.priceAtSale;
            const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
            const lineCost = (s.purchaseCostAtSale || 0) * s.quantitySold;
            return acc + (lineTotal - lineCost);
        }, 0);

        // Top products logic
        const productStats = new Map<string, { quantity: number, revenue: number }>();
        approvedSales.forEach(s => {
            const unitPrice = s.soldFor || s.priceAtSale;
            const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);

            const current = productStats.get(s.productId) || { quantity: 0, revenue: 0 };
            productStats.set(s.productId, {
                quantity: current.quantity + s.quantitySold,
                revenue: current.revenue + lineTotal
            });
        });

        const topProducts = Array.from(productStats.entries())
            .map(([id, stats]) => {
                const p = data.products.find(x => x.id === id);
                return {
                    id,
                    ...stats,
                    name: p?.name || 'Unknown',
                    brand: p?.brandId ? (brandMap[p.brandId] || p.brandId) : 'No Brand'
                };
            })
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 4);

        return {
            revenue,
            profit,
            items,
            margin: revenue > 0 ? (profit / revenue) * 100 : 0,
            avgOrder: approvedSales.length > 0 ? revenue / approvedSales.length : 0,
            pending: pending.length,
            lowStock: data.products.filter(p => (p.quantity <= (p.lowStockAlert || 5)) && p.isActive).length,
            totalInventory: data.products.filter(p => !p.isDeleted).length,
            activeWorkers: data.workers.filter(w => w.isActive).length,
            recent: [...data.sales].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
            topProducts
        };
    }, [data, timeFilter, brandMap]);

    if (loading || authLoading) return <div className="flex h-[80vh] items-center justify-center text-xs font-bold uppercase tracking-widest text-emerald-600/40 animate-pulse">Loading Dashboard...</div>;

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-10">
            <AnimatePresence>
                {showAddDialog && company && (
                    <AddProductDialog company={company} onClose={() => setShowAddDialog(false)} onSuccess={() => { }} />
                )}
            </AnimatePresence>

            {/* MODERN HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-6 rounded-[2rem] shadow-sm">
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Store Overview</p>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {company?.name}</h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-secondary p-1 rounded-xl border border-border">
                        {(['24h', '7d', '30d', '6m', 'all'] as const).map((f) => (
                            <button
                                key={f}
                                onClick={() => setTimeFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                    timeFilter === f ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/10"
                    >
                        <Plus className="w-4 h-4" />
                        Add Sale
                    </button>
                </div>
            </div>

            {/* KPI GRID - DONEZO INSPIRED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Total Revenue" value={formatCurrency(stats.revenue, company?.currency)} icon={Wallet} trend="Total earnings" />
                <KPICard label="Net Profit" value={formatCurrency(stats.profit, company?.currency)} icon={TrendingUp} trend="Actual earnings" />
                <KPICard label="Profit Margin" value={`${stats.margin.toFixed(1)}%`} icon={Percent} trend="Overall health" />
                <KPICard label="Avg Order" value={formatCurrency(stats.avgOrder, company?.currency)} icon={ShoppingCart} trend="Per basket" />
            </div>

            {/* NOTIFICATIONS SECTION */}
            {(stats.pending > 0 || stats.lowStock > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.pending > 0 && <AlertStrip href="/dashboard/sales" count={stats.pending} label="Pending Approvals" icon={Clock} color="bg-orange-500/10 text-orange-600 border-orange-500/20" />}
                    {stats.lowStock > 0 && <AlertStrip href="/dashboard/inventory" count={stats.lowStock} label="Low Stock Products" icon={AlertTriangle} color="bg-destructive/10 text-destructive border-destructive/20" />}
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* RECENT SALES */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-sm font-bold text-foreground">Recent Sales</h3>
                        </div>
                        <Link href="/dashboard/sales" className="text-xs font-semibold text-emerald-600 hover:underline">View All</Link>
                    </div>

                    <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                        {stats.recent.length > 0 ? stats.recent.map((sale) => (
                            <div key={sale.id} className="px-6 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors group border-b last:border-0 border-border/50">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center border border-border/50 shrink-0">
                                        <Package className="w-5 h-5 text-muted-foreground/40 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="text-sm font-semibold text-foreground truncate">
                                            {data.products.find(p => p.id === sale.productId)?.name || 'Deleted Product'}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                                By {data.workers.find(w => w.id === sale.workerId)?.name || 'Staff'}
                                            </p>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">{sale.quantitySold} units</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                    <div className="hidden sm:block">
                                        {(() => {
                                            const unitPrice = sale.soldFor || sale.priceAtSale;
                                            const lineTotal = (sale.soldFor && sale.soldFor >= (sale.priceAtSale * sale.quantitySold)) ? sale.soldFor : (unitPrice * sale.quantitySold);
                                            return <p className="text-sm font-bold text-foreground">{formatCurrency(lineTotal, company?.currency)}</p>;
                                        })()}
                                        <p className="text-[10px] font-medium text-muted-foreground mt-0.5">
                                            {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date(sale.createdAt))}
                                        </p>
                                    </div>
                                    <div className={cn(
                                        "w-2 h-2 rounded-full",
                                        (sale.approved || sale.status === 'approved') ? "bg-emerald-500" : "bg-orange-400 animate-pulse"
                                    )} />
                                </div>
                            </div>
                        )) : (
                            <div className="py-20 text-center text-muted-foreground text-sm font-medium">No sales recorded yet.</div>
                        )}
                    </div>
                </div>

                {/* PERFORMANCE DATA */}
                <div className="lg:col-span-4 space-y-6">
                    {/* TOP PRODUCTS */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Star className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-sm font-bold text-foreground">Top Selling</h3>
                        </div>
                        <div className="bg-card border border-border rounded-3xl p-6 space-y-5 shadow-sm">
                            {stats.topProducts.length > 0 ? stats.topProducts.map((p, i) => (
                                <div key={p.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-muted-foreground/40">#{i + 1}</span>
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">{p.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <span className="text-[9px] font-black text-emerald-600/60 uppercase tracking-widest">{(p as any).brand}</span>
                                                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/20" />
                                                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">{p.quantity} sold</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs font-bold text-emerald-600">{formatCurrency(p.revenue, company?.currency)}</p>
                                </div>
                            )) : (
                                <p className="text-xs text-center text-muted-foreground py-4">Waiting for sales data...</p>
                            )}
                        </div>
                    </div>

                    {/* QUICK STATS */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <BarChart3 className="w-4 h-4 text-emerald-500" />
                            <h3 className="text-sm font-bold text-foreground">Quick Insights</h3>
                        </div>
                        <div className="bg-emerald-900 text-white p-6 rounded-[2rem] space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-emerald-700/50 transition-colors" />
                            <div className="relative space-y-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Inventory Health</p>
                                    <p className="text-lg font-bold">{((1 - (stats.lowStock / (stats.totalInventory || 1))) * 100).toFixed(0)}% Optimal</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">Active Staff</p>
                                    <p className="text-lg font-bold">{stats.activeWorkers} / {data.workers.length} Online</p>
                                </div>
                                <Link href="/dashboard/inventory" className="flex items-center justify-between w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl px-4 transition-all group/btn">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Stock Details</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ label, value, icon: Icon, trend }: any) {
    return (
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-12 h-12" />
            </div>
            <div className="relative space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">{value}</h3>
                </div>
                {trend && (
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-tighter">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

function AlertStrip({ href, count, label, icon: Icon, color }: any) {
    return (
        <Link href={href} className={cn("flex items-center justify-between p-4 border border-border rounded-2xl hover:opacity-80 transition-all group shadow-sm", color)}>
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-background/50 flex items-center justify-center border border-border/50">
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div>
                    <h4 className="text-sm font-bold tracking-tight">{count} {label}</h4>
                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">System Alert</p>
                </div>
            </div>
            <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
    );
}
