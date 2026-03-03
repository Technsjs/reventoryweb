import Link from 'next/link';
import { ArrowLeft, Search, BookOpen, HelpCircle, Zap, Users, Package, BarChart3, ChevronRight } from 'lucide-react';

const CATEGORIES = [
    {
        icon: Package,
        title: "Inventory",
        color: "bg-[#4466B9]",
        articles: ["How to add your first product", "Managing stock levels", "Using product photos", "Bulk product import"],
    },
    {
        icon: BarChart3,
        title: "Analytics",
        color: "bg-emerald-500",
        articles: ["Reading your dashboard", "Understanding sales reports", "Top sellers report", "Exporting your data"],
    },
    {
        icon: Users,
        title: "Staff & Access",
        color: "bg-amber-500",
        articles: ["Inviting a staff member", "Setting up roles", "Tracking staff sales", "Removing a staff account"],
    },
    {
        icon: Zap,
        title: "Getting Started",
        color: "bg-indigo-500",
        articles: ["Setting up your account", "Adding your first product", "Making your first sale", "Connecting multiple branches"],
    },
];

export default function HelpCenter() {
    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans">

            {/* Header */}
            <div className="bg-[var(--price-bg)] text-white px-6 py-20 pb-32 text-center relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Help Center</h1>
                    <p className="text-white/50 font-bold text-lg">Everything you need to run your business with Reventory.</p>
                    <div className="max-w-xl mx-auto relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full pl-14 pr-6 py-5 bg-white text-black rounded-2xl font-bold text-base placeholder:text-slate-400 outline-none shadow-2xl"
                        />
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4466B9]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            </div>

            {/* Categories */}
            <div className="max-w-6xl mx-auto px-6 py-20 -mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.title} className="bg-white border border-slate-100 rounded-[2.5rem] p-10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-14 h-14 ${cat.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                                    <cat.icon size={28} />
                                </div>
                                <h2 className="text-2xl font-black uppercase tracking-tight">{cat.title}</h2>
                            </div>
                            <ul className="space-y-4">
                                {cat.articles.map((article) => (
                                    <li key={article}>
                                        <a href="#" className="flex items-center justify-between text-sm font-bold text-slate-600 hover:text-[#4466B9] group/link transition-colors py-2 border-b border-slate-50">
                                            <span>{article}</span>
                                            <ChevronRight size={16} className="opacity-0 group-hover/link:opacity-100 text-[#4466B9] transition-all" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Still need help */}
            <div className="max-w-6xl mx-auto px-6 pb-32">
                <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-12 text-center space-y-6">
                    <HelpCircle className="mx-auto text-slate-300" size={48} />
                    <h3 className="text-3xl font-black uppercase tracking-tight">Still need help?</h3>
                    <p className="text-slate-500 font-bold">Our support team is online and ready to help you.</p>
                    <Link href="/contact" className="inline-flex px-10 py-5 bg-[#4466B9] text-white rounded-2xl font-black tracking-widest uppercase text-sm hover:scale-105 transition-all shadow-xl shadow-blue-500/20">
                        Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
