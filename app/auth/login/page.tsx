'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lock, Mail, Heart, Eye, EyeOff, Sparkles, CheckCircle2, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn, getAuthErrorMessage } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { user, loading: authLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (!authLoading && user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);

            const q = query(collection(db, 'companies'), where('ownerUID', '==', userCredential.user.uid));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                await auth.signOut();
                throw new Error('This account is not registered as a Business Owner.');
            }

            router.push('/dashboard');
        } catch (err: any) {
            console.error(err);
            setError(getAuthErrorMessage(err));
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-white text-slate-900 flex flex-col md:flex-row">

            {/* Left Side: Showcase */}
            <div className="hidden md:flex md:w-[45%] bg-emerald-950 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Visual Background Elements */}
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
                            Smart Inventory. <br />
                            <span className="text-emerald-400">Better Business.</span>
                        </h1>
                        <p className="mt-8 text-emerald-100/70 text-lg max-w-md leading-relaxed font-medium">
                            The all-in-one console for managing your inventory, staff, and sales performance with ease.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-5"
                    >
                        {[
                            { icon: CheckCircle2, text: "Automated Sales Tracking" },
                            { icon: TrendingUp, text: "Revenue & Profit Insights" },
                            { icon: ShieldCheck, text: "Encrypted Data Security" }
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
                    href="/"
                    className="absolute top-8 left-8 md:top-12 md:left-12 flex items-center gap-2 text-slate-400 hover:text-emerald-600 transition-all font-bold group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm">Home</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-sm space-y-12"
                >
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest border border-emerald-100 shadow-sm shadow-emerald-600/5">
                            <Sparkles className="w-3 h-3" />
                            Registered Owners
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                            Welcome Back.
                        </h2>
                        <p className="text-slate-500 text-sm font-medium italic">
                            Enter your credentials to access your console.
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Account Email</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="owner@business.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-6 text-sm font-semibold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-slate-900"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Security Password</label>
                                    <Link href="/auth/forgot-password" title='Coming soon' className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-wider">
                                        Forgot?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[11px] font-bold text-center"
                            >
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-lg shadow-emerald-600/20"
                        >
                            {loading ? 'Logging in...' : 'Sign In'}
                            {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <div className="pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm font-medium">
                            Don't have an account? <Link href="/auth/register" className="text-emerald-600 font-bold hover:underline underline-offset-4">Join Reventory</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
