'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    Star,
    Send,
    CheckCircle2,
    Lightbulb,
    Bug,
    MessageSquare,
    Heart,
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const FEEDBACK_TYPES = [
    { id: 'general', label: 'General', icon: MessageSquare, color: 'bg-blue-500' },
    { id: 'bug', label: 'Bug Report', icon: Bug, color: 'bg-red-500' },
    { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'bg-amber-500' },
    { id: 'compliment', label: 'Compliment', icon: Heart, color: 'bg-pink-500' },
];

export default function FeedbackPage() {
    const [type, setType] = useState('general');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please write your feedback before submitting.');
            return;
        }
        setError('');
        setSubmitting(true);
        try {
            await addDoc(collection(db, 'feedback'), {
                type,
                rating,
                message: message.trim(),
                email: email.trim() || null,
                createdAt: serverTimestamp(),
                source: 'website',
            });
            setSubmitted(true);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans">
            {/* ── NAV ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-lg border border-slate-100">
                            <Image
                                src="https://res.cloudinary.com/dijhekwvl/image/upload/v1766146257/IMG_9619_ilwzns.jpg"
                                alt="Reventory"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">REVENTORY</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase text-slate-500 hover:text-[#4466B9] transition-colors"
                    >
                        <ArrowLeft size={14} strokeWidth={3} />
                        Back to Home
                    </Link>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-2xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16 space-y-4"
                    >
                        <span className="inline-block text-[10px] font-black tracking-[0.4em] text-[#4466B9] uppercase px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                            Share Your Thoughts
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                            We'd love your<br />
                            <span className="text-[#4466B9]">feedback.</span>
                        </h1>
                        <p className="text-slate-500 text-lg font-medium max-w-md mx-auto">
                            Help us make Reventory better. Every message goes directly to our team.
                        </p>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center py-24 space-y-8"
                            >
                                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                    <CheckCircle2 size={48} className="text-emerald-500" />
                                </div>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-black uppercase tracking-tight">Thank you!</h2>
                                    <p className="text-slate-500 font-medium text-lg">
                                        Your feedback has been received. We appreciate you taking the time.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                    <button
                                        onClick={() => {
                                            setSubmitted(false);
                                            setMessage('');
                                            setEmail('');
                                            setRating(0);
                                            setType('general');
                                        }}
                                        className="px-8 py-4 bg-slate-100 text-slate-800 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all text-sm"
                                    >
                                        Send Another
                                    </button>
                                    <Link
                                        href="/"
                                        className="px-8 py-4 bg-[#4466B9] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all text-sm shadow-xl shadow-blue-500/20"
                                    >
                                        Go Home
                                    </Link>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                onSubmit={handleSubmit}
                                className="space-y-10"
                            >
                                {/* Type */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">
                                        What kind of feedback?
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {FEEDBACK_TYPES.map(({ id, label, icon: Icon, color }) => (
                                            <button
                                                key={id}
                                                type="button"
                                                onClick={() => setType(id)}
                                                className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${type === id
                                                        ? 'border-[#4466B9] bg-blue-50 text-[#4466B9]'
                                                        : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 ${type === id ? 'bg-[#4466B9]' : 'bg-slate-100'} rounded-xl flex items-center justify-center transition-all`}>
                                                    <Icon size={18} className={type === id ? 'text-white' : 'text-slate-400'} />
                                                </div>
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="space-y-4">
                                    <label className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">
                                        How would you rate your experience?
                                    </label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setRating(s)}
                                                onMouseEnter={() => setHoverRating(s)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="transition-transform hover:scale-110 active:scale-95"
                                            >
                                                <Star
                                                    size={36}
                                                    className={`transition-colors ${s <= (hoverRating || rating)
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-slate-200 fill-slate-200'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                        {rating > 0 && (
                                            <span className="self-center text-[11px] font-black tracking-widest uppercase text-slate-400 ml-2">
                                                {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-4">
                                    <label htmlFor="feedback-message" className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">
                                        Your Message <span className="text-[#4466B9]">*</span>
                                    </label>
                                    <textarea
                                        id="feedback-message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        rows={6}
                                        placeholder="Tell us what you think, what's broken, or what you'd love to see..."
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#4466B9] focus:bg-white resize-none transition-all text-sm leading-relaxed"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-4">
                                    <label htmlFor="feedback-email" className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">
                                        Your Email <span className="opacity-40 normal-case tracking-normal">(optional — so we can reply)</span>
                                    </label>
                                    <input
                                        id="feedback-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-[#4466B9] focus:bg-white transition-all text-sm"
                                    />
                                </div>

                                {/* Error */}
                                {error && (
                                    <p className="text-red-500 text-sm font-bold tracking-wide">{error}</p>
                                )}

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-6 bg-[#4466B9] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-60 disabled:scale-100"
                                >
                                    {submitting ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} strokeWidth={2.5} />
                                            Send Feedback
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                </div>
            </main>

            {/* Minimal footer */}
            <footer className="py-10 px-6 border-t border-slate-100 text-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                    © 2026 Reventory System · All Rights Reserved
                </p>
            </footer>
        </div>
    );
}
