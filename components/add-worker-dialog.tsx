'use client';

import { useState } from 'react';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus2, Mail, Phone, ShieldCheck, Key, Copy, Check, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Company } from '@/lib/types';

interface AddWorkerDialogProps {
    company: Company;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddWorkerDialog({ company, onClose, onSuccess }: AddWorkerDialogProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const [generatedPassword, setGeneratedPassword] = useState(() => {
        return Math.random().toString(36).slice(-8);
    });

    const regeneratePassword = () => {
        setGeneratedPassword(Math.random().toString(36).slice(-8));
    };

    const copyPassword = () => {
        navigator.clipboard.writeText(generatedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const createWorker = httpsCallable(functions, 'createWorker');

            const workerData = {
                name: formData.name,
                email: formData.email.toLowerCase().trim(),
                phone: formData.phone.trim(),
                companyRefId: company.companyRefId,
                isActive: true,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                createdBy: company.companyRefId,
                initialPassword: generatedPassword,
            };

            await createWorker({
                email: formData.email.toLowerCase().trim(),
                password: generatedPassword,
                workerData,
                companyRefId: company.companyRefId,
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to deploy worker node');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-8 border-b border-border flex items-center justify-between bg-secondary/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <UserPlus2 className="w-5 h-5" />
                        </div>
                        <div>Add Employee
                            <h3 className="text-sm font-black uppercase tracking-widest"></h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5"></p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto custom-scrollbar">

                    {error && (
                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-[10px] font-bold text-destructive uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Identity</label>
                            <div className="relative group">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase tracking-widest text-foreground"
                                    placeholder="e.g. Ayomide Johnson"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Secure Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase tracking-widest text-foreground"
                                    placeholder="worker@reventory.app"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Contact Phone</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input
                                    required
                                    value={formData.phone}
                                    onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                                    className="w-full bg-muted/50 border border-border rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase tracking-widest text-foreground"
                                    placeholder="+234..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Generation */}
                    <div className="bg-muted/50 border border-border rounded-3xl p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Key className="w-3 h-3 text-muted-foreground" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Access Token</span>
                            </div>
                            <button type="button" onClick={regeneratePassword} className="p-1 hover:bg-background rounded-lg transition-colors">
                                <RefreshCw className="w-3 h-3 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="flex items-center justify-between bg-background border border-border rounded-xl p-4">
                            <span className="text-sm font-mono font-bold tracking-widest text-foreground">{generatedPassword}</span>
                            <button type="button" onClick={copyPassword} className="p-2 hover:bg-muted rounded-lg transition-colors group">
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground" />}
                            </button>
                        </div>
                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">Share this token with the worker. They will use this for their initial authentication.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-5 rounded-[20px] text-xs font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                        >
                            {loading ? 'Initializing Protocol...' : 'Confirm Deployment'}
                        </button>
                    </div>

                </form>
            </motion.div>
        </div>
    );
}
