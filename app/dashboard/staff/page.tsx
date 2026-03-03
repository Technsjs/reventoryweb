'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Search,
    Users,
    X,
    Mail,
    Smartphone,
    Trash2,
    Eye,
    ChevronRight,
    BadgeCheck,
    Calendar,
    Activity,
    ShieldCheck,
    UserCircle2,
    Layers,
    UserMinus,
    ExternalLink,
    Key
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Worker } from '@/lib/types';
import { AddWorkerDialog } from '@/components/add-worker-dialog';

export default function StaffPage() {
    const { company, loading: authLoading } = useAuth();
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

    useEffect(() => {
        if (!company) return;
        const unsubscribe = onSnapshot(collection(db, `companies/${company.companyRefId}/workers`), (snapshot) => {
            setWorkers(snapshot.docs.map(d => ({ ...d.data(), id: d.id }) as Worker));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [company]);

    const filteredWorkers = useMemo(() => {
        return workers.filter(w =>
            w.name.toLowerCase().includes(search.toLowerCase()) ||
            w.email.toLowerCase().includes(search.toLowerCase())
        );
    }, [workers, search]);

    const handleDeleteWorker = async (workerId: string) => {
        if (!company || !confirm('Permanently remove this team member? This action cannot be undone.')) return;
        try {
            await deleteDoc(doc(db, `companies/${company.companyRefId}/workers`, workerId));
            setSelectedWorker(null);
        } catch (error) { console.error(error); }
    };

    if (authLoading || loading) return <div className="flex h-[80vh] items-center justify-center text-xs font-bold uppercase tracking-widest text-emerald-600/40 animate-pulse">Loading Team Members...</div>;

    const staffLimit = company?.staffLimit || (company?.subscriptionPlan === 'starter' ? 1 : company?.subscriptionPlan === 'standard' ? 2 : 5);

    return (
        <div className="flex flex-col gap-6 md:gap-8 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Staff Members</h1>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-emerald-500" />
                        Managing {workers.length} team members
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => setShowAddDialog(true)}
                        disabled={workers.length >= staffLimit}
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                    >
                        <Plus className="w-4 h-4" />
                        Add Staff
                    </button>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <KPICard label="Active Members" value={workers.filter(w => w.isActive).length.toString()} icon={Activity} trend="Online now" />
                <KPICard label="Staff Capacity" value={`${workers.length} / ${staffLimit}`} icon={Layers} trend="Total slots" />
                <KPICard label="Access Level" value="Manager" icon={ShieldCheck} trend="Account root" />
                <KPICard label="Verified" value="100%" icon={BadgeCheck} trend="Identities confirmed" />
            </div>

            {/* SEARCH AREA */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-emerald-500" />
                <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-card border border-border focus:border-emerald-500/50 rounded-2xl py-3 pl-11 shadow-sm transition-all outline-none text-sm font-medium"
                />
            </div>

            {/* TEAM LIST */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Staff ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {filteredWorkers.map((worker) => (
                                <tr key={worker.id} onClick={() => setSelectedWorker(worker)} className="hover:bg-emerald-50/30 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100/50 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                {worker.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-foreground truncate">{worker.name}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground/60 mt-0.5">{worker.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-[10px] font-mono font-bold border border-emerald-100 px-2 py-1 rounded bg-emerald-50/30 text-emerald-800/60 uppercase">
                                            {worker.id.slice(0, 10)}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                            worker.isActive ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground/40 bg-secondary"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", worker.isActive ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/20")} />
                                            {worker.isActive ? 'Active' : 'Offline'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground/30 group-hover:bg-emerald-600 group-hover:text-white transition-all ml-auto">
                                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showAddDialog && company && (
                    <AddWorkerDialog company={company} onClose={() => setShowAddDialog(false)} onSuccess={() => { }} />
                )}
                {selectedWorker && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedWorker(null)} className="absolute inset-0 bg-background/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative w-full max-w-sm bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-2xl shadow-emerald-900/10">
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                                            <UserCircle2 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold tracking-tight text-foreground">{selectedWorker.name}</h2>
                                            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest leading-none mt-1.5">{selectedWorker.role || 'Staff Member'}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedWorker(null)} className="p-2 hover:bg-muted rounded-full transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
                                </div>

                                <div className="space-y-3">
                                    <div className="bg-muted/30 p-4 rounded-2xl flex justify-between items-center group border border-transparent hover:border-emerald-500/20 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Email Address</p>
                                            <p className="text-sm font-semibold text-foreground">{selectedWorker.email}</p>
                                        </div>
                                        <Mail className="w-4 h-4 text-emerald-600/30" />
                                    </div>
                                    {(selectedWorker as any).phone && (
                                        <div className="bg-muted/30 p-4 rounded-2xl flex justify-between items-center group border border-transparent hover:border-emerald-500/20 transition-colors">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Contact Phone</p>
                                                <p className="text-sm font-semibold text-foreground">{(selectedWorker as any).phone}</p>
                                            </div>
                                            <Smartphone className="w-4 h-4 text-emerald-600/30" />
                                        </div>
                                    )}
                                    <div className="bg-emerald-500/5 p-4 rounded-2xl flex justify-between items-center group border border-emerald-500/10 hover:border-emerald-500/20 transition-colors">
                                        <div className="space-y-1 flex-1">
                                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">Access Password</p>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-500">{(selectedWorker as any).initialPassword || '********'}</p>
                                                <button
                                                    onClick={() => {
                                                        const pwd = (selectedWorker as any).initialPassword;
                                                        if (pwd) {
                                                            navigator.clipboard.writeText(pwd);
                                                            alert('Password copied to clipboard');
                                                        }
                                                    }}
                                                    className="text-[10px] font-bold text-emerald-600/40 hover:text-emerald-600 uppercase transition-colors"
                                                >
                                                    Copy
                                                </button>
                                            </div>
                                        </div>
                                        <Key className="w-4 h-4 text-emerald-600/40" />
                                    </div>
                                    <div className="bg-muted/30 p-4 rounded-2xl flex justify-between items-center group border border-transparent hover:border-emerald-500/20 transition-colors">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Employee Reference</p>
                                            <code className="text-[11px] font-mono font-bold text-foreground">{selectedWorker.id}</code>
                                        </div>
                                        <BadgeCheck className="w-4 h-4 text-emerald-600/30" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button onClick={() => handleDeleteWorker(selectedWorker.id)} className="w-full py-4 text-white bg-red-500 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2">
                                        <UserMinus className="w-4 h-4" />
                                        Remove Staff Member
                                    </button>
                                    <p className="text-[10px] text-center text-muted-foreground font-medium italic">Removing a member will revoke all their access instantly.</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function KPICard({ label, value, icon: Icon, trend }: any) {
    return (
        <div className="bg-card p-4 md:p-6 rounded-2xl md:rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50/30 rounded-full blur-2xl group-hover:bg-emerald-100/30 transition-colors" />
            <div className="relative space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors shadow-sm">
                        <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
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
