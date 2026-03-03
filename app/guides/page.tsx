import Link from 'next/link';
import { ArrowLeft, PlayCircle, BookOpen, Clock, ChevronRight } from 'lucide-react';

const GUIDES = [
    {
        category: "Quick Start",
        icon: "🚀",
        guides: [
            { title: "Set up your Reventory account in 5 minutes", time: "5 min read", level: "Beginner" },
            { title: "Add your first 10 products to inventory", time: "8 min read", level: "Beginner" },
            { title: "Make your first sale and record it", time: "4 min read", level: "Beginner" },
        ]
    },
    {
        category: "Advanced Usage",
        icon: "⚡",
        guides: [
            { title: "Set up multi-branch inventory tracking", time: "12 min read", level: "Advanced" },
            { title: "Use analytics to find your top sellers", time: "10 min read", level: "Intermediate" },
            { title: "Manage staff roles and permissions", time: "7 min read", level: "Intermediate" },
        ]
    },
    {
        category: "Team & Scaling",
        icon: "🏢",
        guides: [
            { title: "Invite and onboard your sales staff", time: "6 min read", level: "Beginner" },
            { title: "Track employee performance over time", time: "9 min read", level: "Intermediate" },
            { title: "Upgrade your plan as you grow", time: "3 min read", level: "Beginner" },
        ]
    },
];

const levelColors: Record<string, string> = {
    Beginner: "bg-emerald-50 text-emerald-600",
    Intermediate: "bg-amber-50 text-amber-600",
    Advanced: "bg-[#4466B9]/10 text-[#4466B9]",
};

export default function Guides() {
    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans">

            <div className="bg-[var(--price-bg)] text-white px-6 py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Guides & Tutorials</h1>
                    <p className="text-white/50 font-bold text-lg max-w-xl">Step-by-step walkthroughs to help you master every part of Reventory.</p>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4466B9]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="max-w-5xl mx-auto px-6 py-24 space-y-20">
                {GUIDES.map((section) => (
                    <div key={section.category} className="space-y-8">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                            <span className="text-3xl">{section.icon}</span>
                            <h2 className="text-2xl font-black uppercase tracking-tight">{section.category}</h2>
                        </div>
                        <div className="space-y-4">
                            {section.guides.map((guide) => (
                                <a key={guide.title} href="#" className="flex items-center justify-between p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:bg-white hover:shadow-xl hover:border-[#4466B9]/20 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-[#4466B9]/10 rounded-xl flex items-center justify-center group-hover:bg-[#4466B9] transition-colors">
                                            <BookOpen size={20} className="text-[#4466B9] group-hover:text-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="font-black text-base group-hover:text-[#4466B9] transition-colors">{guide.title}</p>
                                            <div className="flex items-center gap-4">
                                                <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest"><Clock size={12} /> {guide.time}</span>
                                                <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${levelColors[guide.level]}`}>{guide.level}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-[#4466B9] transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
