'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import {
    Plus,
    Search,
    LayoutGrid,
    List,
    TrendingUp,
    Box,
    AlertTriangle,
    X,
    ChevronRight,
    Tag,
    Layers,
    Edit3,
    SearchSlash,
    ArrowUpRight,
    Filter,
    Gem,
    Package,
    ArrowUp,
    Bookmark,
    Zap
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { AddProductDialog } from '@/components/add-product-dialog';

export default function InventoryPage() {
    const { company, loading: authLoading } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [view, setView] = useState<'grid' | 'table'>('table');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!company) return;
        const q = query(collection(db, `companies/${company.companyRefId}/inventory`), orderBy('name', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setProducts(snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as Product).filter(p => !p.isDeleted));
            setLoading(false);
        });

        const unsubCats = onSnapshot(collection(db, `companies/${company.companyRefId}/categories`), (snapshot) => {
            const map: Record<string, string> = {};
            snapshot.docs.forEach(d => { map[d.id] = d.data().name; });
            setCategoryMap(map);
        });

        return () => { unsubscribe(); unsubCats(); };
    }, [company]);

    const stats = useMemo(() => {
        return {
            total: products.length,
            lowStock: products.filter(p => p.quantity <= (p.lowStockAlert || 5) && p.quantity > 0).length,
            outOfStock: products.filter(p => p.quantity === 0).length,
            valuation: products.reduce((acc, p) => acc + ((p.purchaseCost || 0) * p.quantity), 0),
            potentialProfit: products.reduce((acc, p) => acc + ((p.price - (p.purchaseCost || 0)) * p.quantity), 0)
        };
    }, [products]);

    const categories = useMemo(() => {
        const catIds = Array.from(new Set(products.map(p => p.categoryId || 'General').filter(Boolean)));
        return ['All', ...catIds.map(id => id === 'General' ? 'General' : (categoryMap[id] || id))];
    }, [products, categoryMap]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
            const catName = p.categoryId === 'General' || !p.categoryId ? 'General' : (categoryMap[p.categoryId] || p.categoryId);
            const matchesCategory = categoryFilter === 'All' || catName === categoryFilter;
            return matchesSearch && matchesCategory;
        });
    }, [products, search, categoryFilter, categoryMap]);

    if (authLoading || loading) return <div className="flex h-[80vh] items-center justify-center text-xs font-bold uppercase tracking-widest text-emerald-600/40 animate-pulse">Scanning Inventory...</div>;

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Inventory</h1>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <Box className="w-3.5 h-3.5 text-emerald-500" />
                        Managing {stats.total} unique products
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center bg-secondary p-1 rounded-xl border border-border">
                        <button onClick={() => setView('table')} className={cn("p-2 rounded-lg transition-all", view === 'table' ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-foreground")}><List className="w-4 h-4" /></button>
                        <button onClick={() => setView('grid')} className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-foreground")}><LayoutGrid className="w-4 h-4" /></button>
                    </div>
                    <button
                        onClick={() => setShowAddDialog(true)}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all hover:bg-emerald-700 shadow-sm hover:shadow-emerald-100"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </button>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Purchase Valuation" value={formatCurrency(stats.valuation, company?.currency)} icon={TrendingUp} trend="Capital in stock" />
                <KPICard label="Potential Profit" value={formatCurrency(stats.potentialProfit, company?.currency)} icon={Gem} trend="Projected earnings" />
                <KPICard label="Low Stock Items" value={stats.lowStock.toString()} icon={AlertTriangle} alert={stats.lowStock > 0} trend={stats.lowStock > 0 ? "Restock suggested" : "Stocks healthy"} />
                <KPICard label="Items Out of Stock" value={stats.outOfStock.toString()} icon={X} alert={stats.outOfStock > 0} trend="Requires attention" />
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 transition-colors group-focus-within:scale-110" />
                    <input
                        type="text"
                        placeholder="Search product inventory..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-card border-2 border-border focus:border-emerald-500 rounded-2xl py-4 pl-12 shadow-md shadow-emerald-600/5 transition-all outline-none text-base font-semibold placeholder:text-muted-foreground/40"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                    <div className="flex items-center gap-2 px-1">
                        <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border",
                                    categoryFilter === cat ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm" : "bg-card border-border text-muted-foreground hover:border-emerald-200 hover:text-emerald-600"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* LIST AREA */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                {view === 'table' ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border bg-muted/30">
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Stock Level</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Unit Price</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredProducts.length > 0 ? filteredProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-emerald-50/30 transition-colors group cursor-default">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-100/50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                    {p.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                                                    <p className="text-[10px] font-medium text-muted-foreground/60 font-mono mt-0.5 uppercase tracking-tight">SKU: {p.sku || '---'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-secondary text-secondary-foreground uppercase tracking-wider">
                                                {p.categoryId === 'General' || !p.categoryId ? 'General' : (categoryMap[p.categoryId] || p.categoryId)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={cn("text-xs font-bold", p.quantity === 0 ? "text-red-500" : (p.quantity <= (p.lowStockAlert || 5) ? "text-orange-500" : "text-emerald-600"))}>{p.quantity} Units</span>
                                                <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${Math.min(100, (p.quantity / 20) * 100)}%` }}
                                                        className={cn("h-full rounded-full", p.quantity === 0 ? "bg-red-500" : (p.quantity <= (p.lowStockAlert || 5) ? "bg-orange-500" : "bg-emerald-500"))}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <p className="text-sm font-bold text-foreground">{formatCurrency(p.price, company?.currency)}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground/50 mt-0.5 italic">Cost: {formatCurrency(p.purchaseCost || 0, company?.currency)}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all text-muted-foreground/40 group-hover:text-muted-foreground/80"><Edit3 className="w-4 h-4" /></button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                <SearchSlash className="w-10 h-10 opacity-20" />
                                                <p className="text-sm font-medium">No products found matching your search.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/10">
                        {filteredProducts.map(p => (
                            <div key={p.id} className="bg-card p-5 rounded-2xl border border-border hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button>
                                </div>
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-lg">
                                        {p.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground line-clamp-1">{p.name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">{p.categoryId === 'General' || !p.categoryId ? 'General' : (categoryMap[p.categoryId] || p.categoryId)}</span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-[10px] font-medium text-muted-foreground/40 font-mono">SKU: {p.sku || '---'}</span>
                                        </div>
                                    </div>
                                    <div className="pt-4 border-t border-border/50 flex items-end justify-between">
                                        <div className="space-y-1">
                                            <p className="text-base font-bold text-foreground">{formatCurrency(p.price, company?.currency)}</p>
                                            <p className={cn("text-[10px] font-bold uppercase", p.quantity === 0 ? "text-red-500" : (p.quantity <= (p.lowStockAlert || 5) ? "text-orange-500" : "text-emerald-600/70"))}>{p.quantity} In Stock</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showAddDialog && company && (
                    <AddProductDialog company={company} onClose={() => setShowAddDialog(false)} onSuccess={() => { }} />
                )}
            </AnimatePresence>
        </div>
    );
}

function KPICard({ label, value, icon: Icon, alert, trend }: any) {
    return (
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50/50 rounded-full blur-2xl group-hover:bg-emerald-100/50 transition-colors" />
            <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center transition-colors shadow-sm", alert ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600")}>
                        <Icon className="w-5 h-5" />
                    </div>
                    {alert && <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold animate-pulse">Critical</div>}
                </div>
                <div>
                    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">{value}</h3>
                </div>
                {trend && (
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest pt-2 flex items-center gap-1 underline decoration-emerald-100 underline-offset-4">
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}
