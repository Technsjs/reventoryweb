import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Server, RefreshCw, AlertTriangle } from 'lucide-react';

const PILLARS = [
    {
        icon: Lock,
        title: "End-to-End Encryption",
        color: "bg-[#4466B9]",
        body: "All data transmitted between your device and our servers is encrypted using industry-standard TLS 1.3. Your business data is also encrypted at rest using AES-256."
    },
    {
        icon: Eye,
        title: "Access Control",
        color: "bg-indigo-500",
        body: "Only you and staff members you explicitly invite can access your business data. Role-based access ensures staff can only see what they need to see."
    },
    {
        icon: Server,
        title: "Secure Infrastructure",
        color: "bg-slate-700",
        body: "We use Google Firebase — enterprise-grade cloud infrastructure — for hosting and database management, backed by 24/7 monitoring, DDoS protection, and automatic failover."
    },
    {
        icon: RefreshCw,
        title: "Automatic Backups",
        color: "bg-emerald-500",
        body: "Your data is automatically backed up every 24 hours. We retain backups for 30 days so you're always protected against accidental deletion."
    },
    {
        icon: AlertTriangle,
        title: "Incident Response",
        color: "bg-amber-500",
        body: "In the event of a data breach, we commit to notifying affected users within 72 hours and working immediately to contain and remediate any incident."
    },
    {
        icon: ShieldCheck,
        title: "Privacy First Design",
        color: "bg-rose-500",
        body: "We never sell your data. We only collect what is strictly necessary to provide the service. We do not use your business data for advertising or third-party profiling."
    },
];

export default function Security() {
    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans">

            <div className="bg-[var(--price-bg)] text-white px-6 py-24 relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Security</h1>
                    <p className="text-white/50 font-bold text-xl max-w-xl leading-relaxed">
                        Your business data is valuable. We treat it that way with enterprise-grade protection at every layer.
                    </p>
                    <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-black text-[10px] uppercase tracking-widest">All Systems Operational</span>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4466B9]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-24 space-y-20">
                {/* Security Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PILLARS.map((pillar) => (
                        <div key={pillar.title} className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6 hover:shadow-xl hover:-translate-y-1 transition-all group">
                            <div className={`w-14 h-14 ${pillar.color} text-white rounded-2xl flex items-center justify-center shadow-lg`}>
                                <pillar.icon size={28} />
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight">{pillar.title}</h3>
                            <p className="text-slate-500 font-bold leading-relaxed text-sm">{pillar.body}</p>
                        </div>
                    ))}
                </div>

                {/* Report Vulnerability CTA */}
                <div className="bg-[var(--price-bg)] rounded-[3rem] p-14 text-white text-center space-y-8">
                    <ShieldCheck className="mx-auto text-white/30" size={56} />
                    <div className="space-y-4">
                        <h2 className="text-4xl font-black uppercase tracking-tight">Found a Vulnerability?</h2>
                        <p className="text-white/50 font-bold text-lg max-w-xl mx-auto leading-relaxed">
                            We take security reports seriously. If you've discovered a potential security issue, please disclose it responsibly and we'll respond promptly.
                        </p>
                    </div>
                    <a
                        href="mailto:security@reventory.app"
                        className="inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-2xl font-black tracking-widest uppercase text-sm hover:scale-105 transition-all shadow-2xl"
                    >
                        Report to security@reventory.app
                    </a>
                </div>
            </div>
        </div>
    );
}
