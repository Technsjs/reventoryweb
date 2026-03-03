'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    Package,
    Plus,
    Store,
    ShoppingBag,
    History,
    Check,
    X,
    Filter,
    ArrowUpRight,
    SearchSlash,
    Database
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { Sale, Product, Worker } from '@/lib/types';
import { CreateSaleDialog } from '@/components/create-sale-dialog';

interface Branch {
    id: string;
    name: string;
    isMain: boolean;
}

export default function SalesPage() {
    const { company, loading: authLoading } = useAuth();
    const [sales, setSales] = useState<Sale[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [showCreateSale, setShowCreateSale] = useState(false);
    const [selectedBranchId, setSelectedBranchId] = useState<string | 'all'>('all');
    const [showAllBranches, setShowAllBranches] = useState(true);
    const [isSelectedBranchMain, setIsSelectedBranchMain] = useState(false);
    const [brandMap, setBrandMap] = useState<Record<string, string>>({});

    useEffect(() => {
        if (!company) return;
        setLoading(true);
        setSales([]);
        setProducts([]);
        setWorkers([]);
        setBranches([]);

        const companyRefId = company.companyRefId;
        const salesRef = collection(db, `companies/${companyRefId}/sales_log`);
        const pendingSalesRef = collection(db, `companies/${companyRefId}/pending_sales`);
        const productsRef = collection(db, `companies/${companyRefId}/inventory`);
        const workersRef = collection(db, `companies/${companyRefId}/workers`);
        const branchesRef = collection(db, `companies/${companyRefId}/branches`);

        const normalize = (d: any) => {
            const data = d.data();
            return {
                ...data,
                id: d.id,
                createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (typeof data.createdAt === 'number' ? data.createdAt : 0),
            };
        };

        const unsubSales = onSnapshot(salesRef, (s) => {
            const salesData = s.docs.map(d => ({ ...normalize(d), approved: true, status: 'approved', isFromPendingCollection: false }) as Sale);
            setSales(prev => {
                const combined = [...salesData, ...prev.filter(s => s.isFromPendingCollection)];
                return Array.from(new Map(combined.map(item => [item.id, item])).values());
            });
        });

        const unsubPendingCollection = onSnapshot(pendingSalesRef, (s) => {
            const pendingData = s.docs.map(d => ({ ...normalize(d), status: d.data().approved ? 'approved' : 'pending', approved: d.data().approved || false, isFromPendingCollection: true }) as Sale);
            setSales(prev => {
                const combined = [...prev.filter(s => !s.isFromPendingCollection), ...pendingData];
                return Array.from(new Map(combined.map(item => [item.id, item])).values());
            });
        });

        const unsubProducts = onSnapshot(productsRef, (s) => setProducts(s.docs.map(d => ({ ...d.data(), id: d.id }) as Product)));
        const unsubWorkers = onSnapshot(workersRef, (s) => setWorkers(s.docs.map(d => ({ ...d.data(), id: d.id }) as Worker)));
        const unsubBranches = onSnapshot(branchesRef, (s) => {
            const branchesData = s.docs.map(d => ({ ...d.data(), id: d.id }) as Branch);
            setBranches(branchesData);
            setLoading(false);
        });

        const unsubBrands = onSnapshot(collection(db, `companies/${companyRefId}/brands`), (snapshot) => {
            const map: Record<string, string> = {};
            snapshot.docs.forEach(d => { map[d.id] = d.data().name; });
            setBrandMap(map);
        });

        return () => { unsubSales(); unsubPendingCollection(); unsubProducts(); unsubWorkers(); unsubBranches(); unsubBrands(); };
    }, [company]);

    const stats = useMemo(() => {
        const branchFiltered = sales.filter(s => showAllBranches || (isSelectedBranchMain ? (!s.branchId || s.branchId === 'main-branch') : s.branchId === selectedBranchId));

        // CRUCIAL: Top card revenue should only include approved sales from sales_log to match Analytics
        const approvedOnly = branchFiltered.filter(s => !s.isFromPendingCollection);

        const totalRev = approvedOnly.reduce((acc, s) => {
            const unitPrice = s.soldFor || s.priceAtSale;
            const lineTotal = (s.soldFor && s.soldFor >= (s.priceAtSale * s.quantitySold)) ? s.soldFor : (unitPrice * s.quantitySold);
            return acc + lineTotal;
        }, 0);

        return {
            totalRev,
            pendingCount: branchFiltered.filter(s => s.isFromPendingCollection && s.status === 'pending').length
        };
    }, [sales, selectedBranchId, showAllBranches, isSelectedBranchMain]);

    const filteredSales = useMemo(() => {
        return sales.filter(s => {
            const matchesBranch = showAllBranches || (isSelectedBranchMain ? (!s.branchId || s.branchId === 'main-branch') : s.branchId === selectedBranchId);
            if (!matchesBranch) return false;
            const product = products.find(p => p.id === s.productId);
            const worker = workers.find(w => w.id === s.workerId);
            const brandName = product?.brandId ? (brandMap[product.brandId] || '') : '';
            const matchesSearch = product?.name.toLowerCase().includes(search.toLowerCase()) ||
                worker?.name.toLowerCase().includes(search.toLowerCase()) ||
                brandName.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        }).sort((a, b) => b.createdAt - a.createdAt);
    }, [sales, products, workers, search, statusFilter, selectedBranchId, showAllBranches, isSelectedBranchMain, brandMap]);

    const handleAction = async (saleId: string, status: 'approved' | 'rejected') => {
        if (!company) return;
        const sale = sales.find(s => s.id === saleId);
        const collectionName = sale?.isFromPendingCollection ? 'pending_sales' : 'sales_log';
        await updateDoc(doc(db, `companies/${company.companyRefId}/${collectionName}`, saleId), {
            status, approved: status === 'approved', approvedAt: status === 'approved' ? Date.now() : null, approvedBy: company.ownerUID
        });
    };

    if (authLoading || loading) return <div className="flex h-[80vh] items-center justify-center text-xs font-bold uppercase tracking-widest text-emerald-600/40 animate-pulse">Syncing Sales Data...</div>;

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Sales History</h1>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                        Track your daily transactions and revenue
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    {branches.length > 0 && (
                        <div className="hidden lg:flex items-center bg-secondary p-1 rounded-xl border border-border">
                            <div className="p-2 text-muted-foreground opacity-40"><Store className="w-4 h-4" /></div>
                            <select
                                value={showAllBranches ? 'all' : selectedBranchId}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    if (val === 'all') { setShowAllBranches(true); setSelectedBranchId('all'); setIsSelectedBranchMain(false); }
                                    else { const b = branches.find(x => x.id === val); setShowAllBranches(false); setSelectedBranchId(val); setIsSelectedBranchMain(b?.isMain || false); }
                                }}
                                className="bg-transparent border-none text-[10px] font-bold focus:ring-0 outline-none cursor-pointer uppercase tracking-widest pr-8"
                            >
                                <option value="all" className="bg-background">All Locations</option>
                                {branches.map(b => <option key={b.id} value={b.id} className="bg-background">{b.name}</option>)}
                            </select>
                        </div>
                    )}
                    <button
                        onClick={() => setShowCreateSale(true)}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 shadow-sm w-full sm:w-auto shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Add Sale
                    </button>
                </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <div className="col-span-2 bg-emerald-900 text-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden group shadow-xl shadow-emerald-900/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 group-hover:bg-emerald-700 transition-colors" />
                    <div className="relative space-y-3 md:space-y-4">
                        <p className="text-[10px] md:text-xs font-bold text-emerald-300 uppercase tracking-widest">Lifetime Revenue</p>
                        <h3 className="text-2xl md:text-5xl font-bold tracking-tighter">{formatCurrency(stats.totalRev, company?.currency)}</h3>
                        <div className="flex items-center gap-2 pt-1 md:pt-2">
                            <Database className="w-3 h-3 md:w-3.5 md:h-3.5 text-emerald-400 opacity-60" />
                            <span className="text-[9px] md:text-[10px] font-bold text-emerald-100 uppercase tracking-widest truncate">Total of all approved records</span>
                        </div>
                    </div>
                </div>
                <KPICard label="Pending Approvals" value={stats.pendingCount.toString()} icon={Clock} alert={stats.pendingCount > 0} trend="Awaiting review" />
                <KPICard label="System Status" value="Online" icon={History} trend="Sync stable" />
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex items-center bg-secondary p-1 rounded-xl border border-border w-full md:w-auto shrink-0 overflow-x-auto no-scrollbar">
                    {['all', 'pending', 'approved', 'rejected'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setStatusFilter(f as any)}
                            className={cn(
                                "flex-1 md:flex-none px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                                statusFilter === f ? "bg-background text-emerald-600 shadow-sm" : "text-muted-foreground hover:text-emerald-600"
                            )}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-all group-focus-within:text-emerald-500" />
                    <input
                        type="text"
                        placeholder="Search by product or staff name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-card border border-border focus:border-emerald-500/50 rounded-2xl py-3 pl-11 shadow-sm transition-all outline-none text-sm font-medium"
                    />
                </div>
            </div>

            {/* LIST */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product Sold</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Staff Member</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Revenue</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredSales.length > 0 ? filteredSales.map(sale => {
                                const product = products.find(p => p.id === sale.productId);
                                const worker = workers.find(w => w.id === sale.workerId);
                                return (
                                    <tr key={sale.id} className="hover:bg-emerald-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                                                    {product?.name.charAt(0) || 'P'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-foreground truncate">{product?.name || 'Item Deleted'}</p>
                                                    <p className="text-[10px] font-medium text-muted-foreground mt-0.5">{sale.quantitySold} Units • {formatDate(sale.createdAt)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-bold text-muted-foreground/60">{worker?.name.charAt(0) || 'S'}</div>
                                                <span className="text-xs font-semibold text-muted-foreground/80">{worker?.name || 'Staff Member'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {(() => {
                                                const unitPrice = sale.soldFor || sale.priceAtSale;
                                                const lineTotal = (sale.soldFor && sale.soldFor >= (sale.priceAtSale * sale.quantitySold)) ? sale.soldFor : (unitPrice * sale.quantitySold);
                                                return <p className="text-sm font-bold text-foreground">{formatCurrency(lineTotal, company?.currency)}</p>;
                                            })()}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={cn(
                                                "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase border",
                                                sale.status === 'approved' ? "text-emerald-600 border-emerald-500/20 bg-emerald-500/10" :
                                                    sale.status === 'pending' ? "text-blue-600 border-blue-500/20 bg-blue-500/10" : "text-muted-foreground/40 bg-muted"
                                            )}>{sale.status}</span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            {sale.status === 'pending' && (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleAction(sale.id, 'rejected')} className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors border border-transparent hover:border-destructive/20"><X className="w-4 h-4" /></button>
                                                    <button onClick={() => handleAction(sale.id, 'approved')} className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors border border-transparent hover:border-primary/20"><Check className="w-4 h-4" /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                            <SearchSlash className="w-10 h-10 opacity-20" />
                                            <p className="text-sm font-medium">No sales found matching your filters.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>{showCreateSale && company && <CreateSaleDialog company={company} onClose={() => setShowCreateSale(false)} onSuccess={() => { }} />}</AnimatePresence>
        </div>
    );
}

function KPICard({ label, value, icon: Icon, alert, trend }: any) {
    return (
        <div className="bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50/30 rounded-full blur-2xl group-hover:bg-emerald-100/30 transition-colors" />
            <div className="relative space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                    <div className={cn("w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-2xl flex items-center justify-center shadow-sm", alert ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-primary/10 text-primary border border-primary/20")}>
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    {alert && <div className="text-[9px] md:text-[10px] font-extrabold text-destructive bg-destructive/10 px-2 py-1 rounded-lg animate-pulse whitespace-nowrap">Action Required</div>}
                </div>
                <div>
                    <p className="text-[10px] md:text-xs font-semibold text-muted-foreground">{label}</p>
                    <h3 className="text-lg md:text-2xl font-bold tracking-tight text-foreground mt-0.5 md:mt-1">{value}</h3>
                </div>
                {trend && (
                    <p className="text-[9px] md:text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest underline decoration-emerald-100 underline-offset-4">
                        {trend}
                    </p>
                )}
            </div>
        </div>
    );
}
