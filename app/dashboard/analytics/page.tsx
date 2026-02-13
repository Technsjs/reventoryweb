'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import {
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import {
    TrendingUp,
    Activity,
    Target,
    Users,
    Layers,
    ShoppingCart,
    Wallet,
    Percent,
    ArrowUpRight,
    ArrowRight,
    Target as TargetIcon,
    PieChart as PieIcon,
    BarChart3,
    SearchSlash,
    Package,
    ArrowUp,
    Bookmark,
    Zap
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import {
    subDays, subMonths, eachDayOfInterval, isSameDay,
    format, isAfter, addDays
} from 'date-fns';
import type { Sale, Product, Worker } from '@/lib/types';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
    const { company, loading: authLoading } = useAuth();
    const [data, setData] = useState<{
        sales: Sale[];
        products: Product[];
        workers: Worker[];
    }>({
        sales: [],
        products: [],
        workers: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<'24h' | '7d' | '30d' | '6m' | 'all'>('7d');
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
    const [brandMap, setBrandMap] = useState<Record<string, string>>({});

    const normalizeDate = (val: any): number => {
        if (!val) return 0;
        if (val.toMillis) return val.toMillis();
        if (typeof val === 'number') return val;
        return 0;
    };

    useEffect(() => {
        if (!company) return;
        const companyRefId = company.companyRefId;

        const unsubSales = onSnapshot(collection(db, `companies/${companyRefId}/sales_log`), (s) => {
            const sales = s.docs.map(d => ({
                ...d.data(),
                id: d.id,
                createdAt: normalizeDate(d.data().createdAt),
                status: 'approved',
                approved: true
            }) as Sale);
            setData(prev => ({ ...prev, sales }));
        });

        const unsubInventory = onSnapshot(collection(db, `companies/${companyRefId}/inventory`), (s) => {
            setData(prev => ({ ...prev, products: s.docs.map(d => ({ ...d.data(), id: d.id }) as Product) }));
        });

        const unsubWorkers = onSnapshot(collection(db, `companies/${companyRefId}/workers`), (s) => {
            setData(prev => ({ ...prev, workers: s.docs.map(d => ({ ...d.data(), id: d.id }) as Worker) }));
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

        return () => { unsubSales(); unsubInventory(); unsubWorkers(); unsubCats(); unsubBrands(); };
    }, [company]);

    const filteredSales = useMemo(() => {
        const now = new Date();
        let startDate = new Date(0);
        switch (dateRange) {
            case '24h': startDate = subDays(now, 1); break;
            case '7d': startDate = subDays(now, 7); break;
            case '30d': startDate = subDays(now, 30); break;
            case '6m': startDate = subMonths(now, 6); break;
        }

        return data.sales.filter(s =>
            (s.status === 'approved' || s.approved) &&
            isAfter(new Date(s.createdAt), startDate)
        ).sort((a, b) => a.createdAt - b.createdAt);
    }, [data.sales, dateRange]);

    const metrics = useMemo(() => {
        const stats = filteredSales.reduce((acc, s) => {
            const unitPrice = s.soldFor || s.priceAtSale;
            const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
            const lineProfit = lineTotal - ((s.purchaseCostAtSale || 0) * s.quantitySold);

            return {
                rev: acc.rev + lineTotal,
                prof: acc.prof + lineProfit,
                items: acc.items + s.quantitySold,
                orders: acc.orders + 1
            };
        }, { rev: 0, prof: 0, items: 0, orders: 0 });

        return {
            ...stats,
            margin: stats.rev > 0 ? (stats.prof / stats.rev) * 100 : 0,
            avgOrder: stats.orders > 0 ? stats.rev / stats.orders : 0
        };
    }, [filteredSales]);

    const chartData = useMemo(() => {
        const now = new Date();

        if (dateRange === '6m' || dateRange === 'all') {
            const grouped = new Map<string, { date: string, revenue: number, profit: number }>();
            filteredSales.forEach(s => {
                const dateStr = format(new Date(s.createdAt), 'MMM yy');
                const existing = grouped.get(dateStr) || { date: dateStr, revenue: 0, profit: 0 };
                const unitPrice = s.soldFor || s.priceAtSale;
                const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
                const lineProfit = lineTotal - ((s.purchaseCostAtSale || 0) * s.quantitySold);

                grouped.set(dateStr, {
                    date: dateStr,
                    revenue: existing.revenue + lineTotal,
                    profit: existing.profit + lineProfit
                });
            });
            return Array.from(grouped.values());
        }

        if (dateRange === '30d') {
            const startDate = subDays(now, 30);
            const intervals: { date: string, revenue: number, profit: number }[] = [];
            for (let i = 0; i < 10; i++) {
                const chunkStart = addDays(startDate, i * 3);
                const chunkEnd = addDays(chunkStart, 2);
                const chunkSales = filteredSales.filter(s => {
                    const d = new Date(s.createdAt);
                    return d >= chunkStart && d <= chunkEnd;
                });
                const rev = chunkSales.reduce((acc, s) => {
                    const unitPrice = s.soldFor || s.priceAtSale;
                    const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
                    return acc + lineTotal;
                }, 0);
                const prof = chunkSales.reduce((acc, s) => {
                    const unitPrice = s.soldFor || s.priceAtSale;
                    const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
                    const lineCost = (s.purchaseCostAtSale || 0) * s.quantitySold;
                    return acc + (lineTotal - lineCost);
                }, 0);
                intervals.push({ date: format(chunkStart, 'MMM dd'), revenue: rev, profit: prof });
            }
            return intervals;
        }

        const days = dateRange === '7d' ? 7 : (dateRange === '24h' ? 1 : 7);
        const interval = eachDayOfInterval({ start: subDays(now, days - 1), end: now });

        return interval.map(day => {
            const daySales = filteredSales.filter(s => isSameDay(new Date(s.createdAt), day));
            const revenue = daySales.reduce((acc, s) => {
                const unitPrice = s.soldFor || s.priceAtSale;
                const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
                return acc + lineTotal;
            }, 0);
            const profit = daySales.reduce((acc, s) => {
                const unitPrice = s.soldFor || s.priceAtSale;
                const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
                const lineCost = (s.purchaseCostAtSale || 0) * s.quantitySold;
                return acc + (lineTotal - lineCost);
            }, 0);
            return { date: format(day, days === 1 ? 'HH:00' : 'MMM dd'), revenue, profit };
        });
    }, [filteredSales, dateRange]);

    const detailedInsights = useMemo(() => {
        const prodStats = new Map<string, { name: string, qty: number, rev: number }>();
        const staffStats = new Map<string, { name: string, rev: number, sales: number, active: boolean }>();
        const brandStats = new Map<string, { name: string, rev: number, profit: number }>();

        filteredSales.forEach(s => {
            const p = data.products.find(x => x.id === s.productId);
            const pName = p?.name || 'Deleted Product';

            // Resolve Brand Name
            const bId = p?.brandId || 'No Brand';
            const brandName = brandMap[bId] || bId;

            const unitPrice = s.soldFor || s.priceAtSale;
            const rev = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
            const profit = rev - ((s.purchaseCostAtSale || 0) * s.quantitySold);

            const cp = prodStats.get(s.productId) || { name: pName, qty: 0, rev: 0 };
            prodStats.set(s.productId, { name: pName, qty: cp.qty + s.quantitySold, rev: cp.rev + rev });

            const w = data.workers.find(x => x.id === s.workerId);
            const wName = w?.name || 'Staff Member';
            const cw = staffStats.get(s.workerId) || { name: wName, rev: 0, sales: 0, active: !!w?.isActive };
            staffStats.set(s.workerId, { name: wName, rev: cw.rev + rev, sales: cw.sales + 1, active: !!w?.isActive });

            const cb = brandStats.get(brandName) || { name: brandName, rev: 0, profit: 0 };
            brandStats.set(brandName, { name: brandName, rev: cb.rev + rev, profit: cb.profit + profit });
        });

        return {
            topProducts: Array.from(prodStats.values()).sort((a, b) => b.qty - a.qty).slice(0, 5),
            topStaff: Array.from(staffStats.values()).sort((a, b) => b.rev - a.rev).slice(0, 4),
            topBrands: Array.from(brandStats.values()).sort((a, b) => b.rev - a.rev).slice(0, 5)
        };
    }, [filteredSales, data.products, data.workers, brandMap]);

    if (authLoading || loading) return <div className="flex h-[80vh] items-center justify-center text-xs font-bold uppercase tracking-widest text-emerald-600/40 animate-pulse">Scanning Insights...</div>;

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-12">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Insights & Analytics</h1>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
                        Performance overview for your business
                    </p>
                </div>

                <div className="flex items-center bg-secondary p-1 rounded-xl border border-border">
                    {['24h', '7d', '30d', '6m', 'all'].map(range => (
                        <button
                            key={range}
                            onClick={() => setDateRange(range as any)}
                            className={cn(
                                "px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                                dateRange === range ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard label="Total Revenue" value={formatCurrency(metrics.rev, company?.currency)} icon={Wallet} trend="Total earnings" />
                <MetricCard label="Net Profit" value={formatCurrency(metrics.prof, company?.currency)} icon={TrendingUp} trend="Actual earnings" />
                <MetricCard label="Profit Margin" value={`${metrics.margin.toFixed(1)}%`} icon={Percent} trend="Overall health" />
                <MetricCard label="Avg Order" value={formatCurrency(metrics.avgOrder, company?.currency)} icon={ShoppingCart} trend="Per basket" />
            </div>

            {/* CHARTS & LISTS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* GROWTH CHART */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="px-2 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-foreground">Revenue Trajectory</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Revenue</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-emerald-200" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Profit</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-[2.5rem] p-6 md:p-8 shadow-sm">
                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} dy={15} />
                                    <YAxis tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold', padding: '12px 16px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#059669" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                    <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="6 6" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* TOP BRANDS */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground px-2">Brand Performance</h3>
                            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm divide-y divide-border/50">
                                {detailedInsights.topBrands.length > 0 ? detailedInsights.topBrands.map((b, i) => (
                                    <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-emerald-50/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Bookmark className="w-3.5 h-3.5 text-emerald-500/40" />
                                            <span className="text-xs font-semibold text-foreground uppercase tracking-tight">{b.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600">{formatCurrency(b.rev, company?.currency)}</span>
                                    </div>
                                )) : <div className="py-10 text-center text-[10px] font-bold text-muted-foreground/30 uppercase italic">No brands tracked</div>}
                            </div>
                        </div>

                        {/* TOP STAFF */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-foreground px-2">Top Performers</h3>
                            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm divide-y divide-border/50">
                                {detailedInsights.topStaff.length > 0 ? detailedInsights.topStaff.map((s, i) => (
                                    <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-emerald-50/30 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold">{s.name.charAt(0)}</div>
                                            <span className="text-xs font-semibold text-foreground">{s.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600">{s.sales} Sales</span>
                                    </div>
                                )) : <div className="py-10 text-center text-[10px] font-bold text-muted-foreground/30 uppercase italic">No activities yet</div>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TOP PRODUCTS */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-foreground px-2">Top Selling Products</h3>
                        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm divide-y divide-border/50">
                            {detailedInsights.topProducts.map((p, i) => (
                                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-emerald-50/30 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold">{i + 1}</div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase">{p.qty} Units Sold</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-emerald-600">{formatCurrency(p.rev, company?.currency)}</p>
                                    </div>
                                </div>
                            ))}
                            {detailedInsights.topProducts.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center opacity-20">
                                    <Package className="w-10 h-10" />
                                    <p className="text-xs font-bold uppercase mt-4">No Data</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* GROWTH AD */}
                    {company?.subscriptionPlan !== 'pro' && (
                        <div className="space-y-4 pt-2">
                            <div className="bg-emerald-900 text-white p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden group shadow-xl shadow-emerald-900/10">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 transition-colors" />
                                <div className="relative z-10 space-y-4">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-sm">
                                        <Zap className="w-6 h-6 text-emerald-300 fill-emerald-300" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold tracking-tight">Growth Forecast</h4>
                                        <p className="text-xs text-emerald-100/60 font-medium leading-relaxed">Upgrade to unlock predictive analytics and inventory optimization tools.</p>
                                    </div>
                                    <Link href="/dashboard/billing" className="block w-full py-3.5 bg-white text-emerald-900 rounded-xl text-xs font-bold uppercase tracking-widest text-center hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10">
                                        Explore Pro
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon: Icon, trend }: any) {
    return (
        <div className="bg-card p-6 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-12 h-12" />
            </div>
            <div className="relative space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">{value}</h3>
                </div>
                {trend && (
                    <div className="flex items-center gap-1 uppercase tracking-tighter">
                        <span className="text-[10px] font-bold text-emerald-600/60">{trend}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
