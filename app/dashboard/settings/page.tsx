'use client';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, updateDoc, collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Mail,
    Globe,
    Zap,
    Tag,
    Layers,
    X,
    Check,
    LogOut,
    Settings,
    Bell,
    Database,
    Fingerprint,
    Key,
    Lock,
    ChevronRight,
    Activity,
    Shield,
    Trash2,
    Info,
    Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function SettingsPage() {
    const { company, signOut } = useAuth();
    const [editingName, setEditingName] = useState(false);
    const [editingIndustry, setEditingIndustry] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempIndustry, setTempIndustry] = useState('');

    const saveName = async () => {
        if (!company || !tempName.trim()) return;
        await updateDoc(doc(db, 'companies', company.companyRefId), { name: tempName.trim() });
        setEditingName(false);
    };

    const saveIndustry = async () => {
        if (!company || !tempIndustry.trim()) return;
        await updateDoc(doc(db, 'companies', company.companyRefId), { industry: tempIndustry.trim() });
        setEditingIndustry(false);
    };

    return (
        <div className="flex flex-col gap-6 md:gap-10 pb-20">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border border-border p-4 md:p-6 rounded-2xl md:rounded-[2rem] shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">General Settings</h1>
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Settings className="w-3.5 h-3.5 text-emerald-500" />
                        Management Dashboard • ID: {company?.companyRefId}
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => confirm('Log out of secure session?') && signOut()}
                        className="bg-destructive/10 text-destructive px-5 py-2.5 rounded-xl text-xs font-bold border border-destructive/20 flex items-center justify-center gap-2 transition-all hover:bg-destructive/20 w-full md:w-auto"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT COLUMN */}
                <div className="lg:col-span-8 space-y-8">

                    {/* PLAN OVERVIEW */}
                    <div className="bg-emerald-900 text-white rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 relative overflow-hidden group shadow-xl shadow-emerald-900/10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 transition-colors" />
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 shadow-lg backdrop-blur-sm">
                                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-emerald-300 fill-emerald-300" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="text-lg md:text-2xl font-bold tracking-tight capitalize">{company?.subscriptionPlan} Plan</h3>
                                    <p className="text-[10px] font-semibold text-emerald-100/60 uppercase tracking-widest">Active </p>
                                </div>
                            </div>
                            <button className="w-full md:w-auto px-6 py-2.5 bg-white text-emerald-900 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10">Manage Subscription</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* COMPANY INFO */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-2 flex items-center gap-2">
                                <Building2 className="w-3.5 h-3.5" />
                                Company Info
                            </h3>
                            <div className="bg-card border border-border rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm">
                                <EditableItem
                                    label="Brand Identity"
                                    value={company?.name || ''}
                                    onSave={saveName}
                                    icon={<Building2 className="w-4 h-4" />}
                                    isEditing={editingName}
                                    setIsEditing={setEditingName}
                                    tempValue={tempName}
                                    setTempValue={setTempName}
                                />
                                <EditableItem
                                    label="Business Category"
                                    value={company?.industry || 'Unclassified'}
                                    onSave={saveIndustry}
                                    icon={<Layers className="w-4 h-4" />}
                                    isEditing={editingIndustry}
                                    setIsEditing={setEditingIndustry}
                                    tempValue={tempIndustry}
                                    setTempValue={setTempIndustry}
                                />
                                <div className="p-4 md:p-6 flex items-center justify-between group hover:bg-muted/30 transition-colors border-t border-border/50">
                                    <div className="flex items-center gap-4 md:gap-5">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 opacity-60"><Globe className="w-3.5 h-3.5" /></div>
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Select Currency</p>
                                            <select
                                                value={company?.currency || 'NGN'}
                                                onChange={async (e) => await updateDoc(doc(db, 'companies', company!.companyRefId), { currency: e.target.value })}
                                                className="bg-transparent border-none text-sm font-bold focus:ring-0 p-0 cursor-pointer text-foreground appearance-none pr-8"
                                            >
                                                <option value="NGN" className="bg-background">Nigerian Naira (NGN)</option>
                                                <option value="USD" className="bg-background">US Dollar (USD)</option>
                                                <option value="GBP" className="bg-background">British Pound (GBP)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECURITY */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-2 flex items-center gap-2">
                                <Shield className="w-3.5 h-3.5" />
                                Security
                            </h3>
                            <div className="bg-card border border-border rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm">
                                <StaticItem label="Owner Email" value={company?.email || ''} icon={<Mail className="w-4 h-4" />} />
                                <StaticItem label="Encryption Status" value="Secure RSA-4096" icon={<Fingerprint className="w-4 h-4" />} />
                                <StaticItem label="System Version" value="v3.2 Stable" icon={<Info className="w-4 h-4" />} />
                            </div>
                        </section>
                    </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 lg:h-[calc(100vh-140px)] lg:overflow-y-auto pr-2 custom-scrollbar">
                    <div className="space-y-8 pb-10">
                        <CollectionsManager companyRefId={company?.companyRefId} />

                        {/* GLOSSARY / INFO */}
                        <div className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-emerald-600" />
                                <h4 className="text-sm font-bold text-foreground tracking-tight">Reventory Terms</h4>
                            </div>
                            <div className="space-y-4">
                                <TermItem label="Revenue" desc="Total cash generated from your sales before any expenses." />
                                <TermItem label="Net Profit" desc="Your actual earnings: Revenue minus the purchase cost of sold items." />
                                <TermItem label="Profit Margin" desc="The percentage of your revenue that is pure profit." />
                                <TermItem label="Stock Valuation" desc="The total value of your current stock based on purchase costs." />
                                <TermItem label="Pending Sale" desc="Sales made by staff that await your final approval." />
                            </div>
                        </div>

                        <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <Bell className="w-5 h-5 text-primary" />
                                <h4 className="text-sm font-bold text-foreground tracking-tight">Recent Notifications</h4>
                            </div>
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed italic">Important system updates and security alerts will appear here.</p>
                            <div className="flex items-center gap-3 p-4 bg-muted/40 rounded-2xl border border-primary/10 backdrop-blur-sm shadow-sm group">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-bold text-primary dark:text-primary uppercase tracking-widest group-hover:scale-105 transition-transform">System Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TermItem({ label, desc }: { label: string, desc: string }) {
    return (
        <div className="space-y-1 group">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-emerald-500" />
                {label}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed pl-3">{desc}</p>
        </div>
    );
}

function EditableItem({ label, value, icon, isEditing, setIsEditing, tempValue, setTempValue, onSave }: any) {
    return (
        <div className="p-4 md:p-6 bg-card flex items-center justify-between group transition-all hover:bg-muted/30 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-5 flex-1">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 opacity-60 group-hover:opacity-100 transition-all">{icon}</div>
                <div className="flex-1 space-y-0.5">
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{label}</p>
                    {isEditing ? (
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="text"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                className="flex-1 bg-muted border border-border rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-emerald-500/30"
                                autoFocus
                            />
                            <button onClick={onSave} className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20"><Check className="w-3.5 h-3.5" /></button>
                        </div>
                    ) : (
                        <p className="text-sm font-bold text-foreground">{value}</p>
                    )}
                </div>
            </div>
            {!isEditing && (
                <button onClick={() => { setTempValue(value); setIsEditing(true); }} className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 hover:underline transition-all pr-2">Edit</button>
            )}
        </div>
    );
}

function StaticItem({ label, value, icon }: any) {
    return (
        <div className="p-4 md:p-6 bg-card flex items-center justify-between group hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0">
            <div className="flex items-center gap-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20 opacity-60 group-hover:opacity-100 transition-all">{icon}</div>
                <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{value}</p>
                </div>
            </div>
        </div>
    );
}

function CollectionsManager({ companyRefId }: { companyRefId?: string }) {
    const [brands, setBrands] = useState<{ id: string, name: string }[]>([]);
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);

    useEffect(() => {
        if (!companyRefId) return;
        const bRef = collection(db, `companies/${companyRefId}/brands`);
        const cRef = collection(db, `companies/${companyRefId}/categories`);
        const unsubB = onSnapshot(bRef, (s) => setBrands(s.docs.map(d => ({ id: d.id, name: d.data().name }))));
        const unsubC = onSnapshot(cRef, (s) => setCategories(s.docs.map(d => ({ id: d.id, name: d.data().name }))));
        return () => { unsubB(); unsubC(); };
    }, [companyRefId]);

    const remove = async (col: string, id: string) => {
        if (confirm(`Remove this item?`)) {
            await deleteDoc(doc(db, `companies/${companyRefId}/${col}`, id));
        }
    };

    return (
        <div className="bg-card border border-border rounded-2xl md:rounded-[2.5rem] p-6 md:p-8 space-y-10 shadow-sm">
            <section className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                    <Tag className="w-3.5 h-3.5 text-emerald-500/40" /> Brands
                </h4>
                <div className="flex flex-wrap gap-2">
                    {brands.length > 0 ? brands.map(b => (
                        <div key={b.id} className="group flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl transition-all hover:border-primary/40">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-tight">{b.name}</span>
                            <button onClick={() => remove('brands', b.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"><X className="w-3 h-3" /></button>
                        </div>
                    )) : <p className="text-[10px] font-medium text-muted-foreground/30 px-1 italic">No brands added yet.</p>}
                </div>
            </section>

            <section className="space-y-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 px-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-500/40" /> Product Categories
                </h4>
                <div className="flex flex-wrap gap-2">
                    {categories.length > 0 ? categories.map(c => (
                        <div key={c.id} className="group flex items-center gap-2 px-3 py-1.5 bg-secondary border border-border rounded-xl transition-all hover:border-muted-foreground/20">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{c.name}</span>
                            <button onClick={() => remove('categories', c.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"><X className="w-3 h-3" /></button>
                        </div>
                    )) : <p className="text-[10px] font-medium text-muted-foreground/30 px-1 italic">No categories added yet.</p>}
                </div>
            </section>
        </div>
    );
}
