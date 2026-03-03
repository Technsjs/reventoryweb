'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In real scenario, this would call an API
        setSent(true);
    };

    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans">

            <div className="bg-[var(--price-bg)] text-white px-6 py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Contact Us</h1>
                    <p className="text-white/50 font-bold text-lg">We're here. Talk to our team — usually responsive within a few hours.</p>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4466B9]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Contact Options */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight">Get in Touch</h2>

                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                            <div className="w-12 h-12 bg-[#4466B9] rounded-2xl flex items-center justify-center">
                                <Mail size={24} className="text-white" />
                            </div>
                            <h3 className="font-black uppercase text-lg tracking-tight">Email Support</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed">Send us a message and we'll respond within 12 hours on business days.</p>
                            <a href="mailto:support@reventory.app" className="block font-black text-[#4466B9] text-sm uppercase tracking-widest hover:underline">support@reventory.app</a>
                        </div>

                        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                                <MessageCircle size={24} className="text-white" />
                            </div>
                            <h3 className="font-black uppercase text-lg tracking-tight">In-App Chat</h3>
                            <p className="text-slate-500 font-bold text-sm leading-relaxed">Already a user? Open the app and tap the headphones icon for direct support.</p>
                        </div>

                        <div className="p-8 bg-[#4466B9]/5 border border-[#4466B9]/10 rounded-[2rem] space-y-2">
                            <p className="font-black text-[10px] uppercase tracking-widest text-[#4466B9]">Support Hours</p>
                            <p className="font-black text-2xl">Mon – Fri</p>
                            <p className="text-slate-500 font-bold text-sm">9am – 6pm WAT</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {sent ? (
                            <div className="h-full flex items-center justify-center p-20 bg-slate-50 rounded-[3rem] border border-slate-100 text-center space-y-8">
                                <div className="space-y-6">
                                    <CheckCircle2 className="mx-auto text-emerald-500" size={64} />
                                    <h3 className="text-4xl font-black uppercase">Message Sent!</h3>
                                    <p className="text-slate-500 font-bold">We'll get back to you within 12 hours.</p>
                                    <Link href="/" className="inline-block px-10 py-5 bg-[#4466B9] text-white rounded-2xl font-black tracking-widest uppercase text-sm hover:scale-105 transition-all shadow-xl shadow-blue-500/20">
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Name</label>
                                        <input
                                            required
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            placeholder="John Doe"
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-base outline-none focus:border-[#4466B9] focus:ring-2 focus:ring-[#4466B9]/10 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                            placeholder="john@shop.com"
                                            className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-base outline-none focus:border-[#4466B9] focus:ring-2 focus:ring-[#4466B9]/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</label>
                                    <input
                                        required
                                        value={form.subject}
                                        onChange={e => setForm({ ...form, subject: e.target.value })}
                                        placeholder="What can we help you with?"
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-base outline-none focus:border-[#4466B9] focus:ring-2 focus:ring-[#4466B9]/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message</label>
                                    <textarea
                                        required
                                        rows={8}
                                        value={form.message}
                                        onChange={e => setForm({ ...form, message: e.target.value })}
                                        placeholder="Describe your issue or question in detail..."
                                        className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-base outline-none focus:border-[#4466B9] focus:ring-2 focus:ring-[#4466B9]/10 transition-all resize-none leading-relaxed"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-6 bg-[#4466B9] text-white rounded-2xl font-black tracking-widest uppercase text-sm hover:scale-[1.02] transition-all shadow-2xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Send size={18} />
                                    Send Message
                                </button>
                                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">We respect your privacy. No spam, ever.</p>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
