'use client';

import { useEffect, useState } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Download, Smartphone, ArrowLeft } from 'lucide-react';

export default function GenericDownloadTracker() {
    const source = "direct";
    const [tracked, setTracked] = useState(false);

    useEffect(() => {
        const trackDownload = async () => {
            try {
                if (!tracked) {
                    await addDoc(collection(db, "downloadsfrom"), {
                        source: source,
                        timestamp: serverTimestamp(),
                        userAgent: navigator.userAgent,
                        platform: navigator.platform
                    });
                    setTracked(true);
                }
            } catch (error) {
                console.error("Error tracking download:", error);
            }
        };

        trackDownload();
    }, [tracked]);

    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans selection:bg-blue-100 flex flex-col items-center justify-center px-6">

            {/* Background decoration - solid blocks as requested */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-slate-50 -z-10" />

            <div className="max-w-xl w-full space-y-16 text-center">

                <div className="space-y-6">
                    <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors font-bold text-xs uppercase tracking-widest mb-8">
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                    <div className="flex justify-center mb-10">
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-xl">
                            <Image
                                src="https://res.cloudinary.com/dijhekwvl/image/upload/v1766146257/IMG_9619_ilwzns.jpg"
                                alt="Reventory"
                                width={64}
                                height={64}
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">Get Reventory</h1>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">
                        Select your device platform below to start managing your shop inventory and sales on the go.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {/* iOS Option */}
                    <a
                        href="https://apps.apple.com/us/app/reventory-inventory-stock/id6747654868" // Placeholder
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-8 bg-black text-white rounded-[1.5rem] hover:opacity-90 transition-all active:scale-95 shadow-2xl"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white"><Download size={32} /></div>
                            <div className="text-left">
                                <p className="text-xs opacity-40 uppercase tracking-[0.2em] font-bold">Recommended for iPhone</p>
                                <p className="text-2xl font-bold">Apple iOS</p>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="rotate-180" size={24} />
                        </div>
                    </a>

                    {/* Android Option */}
                    <a
                        href="https://play.google.com/store/apps/details?id=com.reventory.app" // Placeholder
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center justify-between p-8 bg-[#4466B9] text-white rounded-[1.5rem] hover:opacity-90 transition-all active:scale-95 shadow-2xl"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white"><Smartphone size={32} /></div>
                            <div className="text-left">
                                <p className="text-xs opacity-40 uppercase tracking-[0.2em] font-bold">Recommended for Android</p>
                                <p className="text-2xl font-bold">Google Android</p>
                            </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowLeft className="rotate-180" size={24} />
                        </div>
                    </a>
                </div>

                <div className="pt-10 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-widest leading-none">
                        <Check size={14} className="text-emerald-500" />
                        Verified & Secure Download
                    </div>
                </div>

            </div>

            <footer className="mt-32 text-slate-300 text-[10px] font-bold uppercase tracking-widest text-center">
                © 2026 Reventory · Inventory Management Solution
            </footer>
        </div>
    );
}

function Check({ size, className }: { size: number, className: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}
