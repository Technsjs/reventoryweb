'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building2, Lock, Mail, User, Globe, Briefcase, Zap, Sparkles, Store, Heart, CheckCircle2, Eye, EyeOff, ShieldCheck, TrendingUp } from 'lucide-react';
import { getAuthErrorMessage } from '@/lib/utils';

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        password: '',
        confirmPassword: '',
        industry: '',
        country: 'Nigeria'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const generateCompanyRefId = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const timestamp = Date.now().toString();
        const suffix = timestamp.substring(timestamp.length - 3);
        let prefix = '';
        for (let i = 0; i < 3; i++) {
            prefix += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `REV-${prefix}-${suffix}`;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (step < 3) return;

        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email.trim().toLowerCase(),
                formData.password
            );

            const companyRefId = generateCompanyRefId();
            const now = Date.now();

            const companyData = {
                companyRefId,
                name: formData.businessName,
                email: formData.email.trim().toLowerCase(),
                ownerUID: userCredential.user.uid,
                createdAt: now,
                updatedAt: now,
                industry: formData.industry,
                country: formData.country,
                subscriptionPlan: 'starter',
                purchasedWorkerSlots: 1,
                paymentHistory: [],
                currency: formData.country === 'Nigeria' ? 'NGN' : 'USD'
            };

            await setDoc(doc(db, 'companies', companyRefId), companyData);

            const branchId = 'main-branch';
            await setDoc(doc(db, `companies/${companyRefId}/branches`, branchId), {
                id: branchId,
                name: 'Main Branch',
                address: '',
                phone: '',
                companyRefId,
                createdBy: userCredential.user.uid,
                createdAt: now,
                updatedAt: now,
                isMain: true
            });

            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(getAuthErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (!mounted) return null;

    const countries = [
        "Nigeria", "Ghana", "Kenya", "South Africa", "Rwanda", "Egypt",
        "Uganda", "Ethiopia", "Tanzania", "Cameroon", "Ivory Coast",
        "Senegal", "Zambia", "Zimbabwe", "Morocco"
    ];

    const nextStep = () => {
        if (step === 1) {
            if (!formData.businessName || !formData.industry || !formData.country) {
                setError('Please fill in your business details.');
                return;
            }
        } else if (step === 2) {
            if (!formData.email || !formData.email.includes('@')) {
                setError('Please enter a valid work email.');
                return;
            }
        }

        setError('');
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setError('');
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (step < 3) {
                nextStep();
            } else {
                handleRegister(e as any);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col md:flex-row">

            {/* Left Side: Showcase */}
            <div className="hidden md:flex md:w-[45%] bg-emerald-950 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute top-0 right-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-600 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500 blur-[100px] rounded-full opacity-20" />
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10"
                >
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                            <Heart className="w-6 h-6 fill-white text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Reventory</span>
                    </Link>
                </motion.div>

                <div className="relative z-10 space-y-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-6xl font-bold leading-tight tracking-tight">
                            Growth Starts <br />
                            <span className="text-emerald-400">Right Here.</span>
                        </h1>
                        <p className="mt-8 text-emerald-100/70 text-lg max-w-md leading-relaxed font-medium">
                            Join the next generation of business management. Simple tools for powerful results.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-5"
                    >
                        {[
                            { icon: CheckCircle2, text: "Cloud-Based Inventory Sync" },
                            { icon: TrendingUp, text: "Real-time Profit Analytics" },
                            { icon: Store, text: "Scalable Multi-Store Support" }
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-4 text-emerald-50">
                                <div className="p-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                                    <feature.icon className="w-5 h-5" />
                                </div>
                                <span className="font-semibold">{feature.text}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    className="relative z-10 text-xs text-emerald-100 font-bold uppercase tracking-widest"
                >
                    &copy; {new Date().getFullYear()} Reventory. Smart Management.
                </motion.div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-16 relative">
                <Link
                    href="/auth/login"
                    className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-bold group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Sign In Instead</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm space-y-8"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                            <Sparkles className="w-3 h-3" />
                            Registration Step {step}
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                            {step === 1 ? "Your Business." : step === 2 ? "Your Details." : "Security."}
                        </h2>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: "33.33%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        />
                    </div>

                    <form onSubmit={handleRegister} onKeyDown={handleKeyPress} className="space-y-6">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Business Name</label>
                                        <div className="relative group">
                                            <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                name="businessName"
                                                placeholder="e.g. Skyline Retail"
                                                required
                                                value={formData.businessName}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Industry</label>
                                        <div className="relative group">
                                            <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                                            <select
                                                name="industry"
                                                required
                                                value={formData.industry}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-10 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                                            >
                                                <option value="">Select industry</option>
                                                <option value="Retail">Retail & Wholesale</option>
                                                <option value="Electronics">Electronics & Gadgets</option>
                                                <option value="Fashion">Fashion & Apparel</option>
                                                <option value="Pharmacy">Pharmacy / Healthcare</option>
                                                <option value="Food">Food & Hospitality</option>
                                                <option value="Other">General Services</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Region</label>
                                        <div className="relative group">
                                            <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors pointer-events-none" />
                                            <select
                                                name="country"
                                                required
                                                value={formData.country}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-10 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all appearance-none"
                                            >
                                                {countries.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                name="email"
                                                type="email"
                                                placeholder="owner@business.com"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm shadow-emerald-600/5">
                                        <p className="text-xs font-semibold text-emerald-800 leading-relaxed flex gap-2">
                                            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                                            You'll use this email to log in and receive business performance reports.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="space-y-5"
                                >
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Account Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Min. 6 characters"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-14 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors p-1"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirm Identity</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                            <input
                                                name="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Repeat password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-14 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-emerald-600 transition-colors p-1"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-bold text-center flex items-center justify-center gap-2"
                            >
                                <Zap className="w-4 h-4" />
                                {error}
                            </motion.div>
                        )}

                        <div className="flex flex-col gap-3">
                            <button
                                type="button"
                                onClick={step < 3 ? nextStep : (e) => handleRegister(e as any)}
                                disabled={loading}
                                className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? 'Creating Account...' : step < 3 ? 'Continue' : 'Start Business'}
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>

                            {step > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="w-full py-2 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    Previous Step
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Already registered? <Link href="/auth/login" className="text-emerald-600 font-bold hover:underline underline-offset-4">Log in here</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
