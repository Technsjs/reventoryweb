'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    ShoppingCart,
    Users,
    LayoutDashboard,
    Settings,
    Menu,
    X,
    CreditCard,
    ChevronRight,
    BarChart3,
    Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from '@/components/mode-toggle';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, company, loading, signOut } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
        { label: 'Inventory', href: '/dashboard/inventory', icon: Package },
        { label: 'Sales', href: '/dashboard/sales', icon: ShoppingCart },
        { label: 'Staff Members', href: '/dashboard/staff', icon: Users },
        { label: 'Subscription', href: '/dashboard/billing', icon: CreditCard },
        { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin relative z-10 mx-auto" />
                <div className="mt-8 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                    Loading Your Inventory...
                </div>
            </div>
        );
    }

    if (!user || !company) return null;

    const logoSrc = "https://res.cloudinary.com/dijhekwvl/image/upload/v1766146257/IMG_9619_ilwzns.jpg";

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors overflow-x-hidden">

            {/* Flat Mobile Header */}
            <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-[50]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-border">
                        <Image src={logoSrc} alt="Logo" width={32} height={32} className="object-cover" />
                    </div>
                    <span className="font-bold tracking-tight text-emerald-600">Reventory</span>
                </div>
                <div className="flex items-center gap-2">
                    <ModeToggle />
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-secondary rounded-lg">
                        {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </header>

            <div className="flex relative">
                {/* Mobile Backdrop */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[90] md:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 z-[100] w-72 bg-card/95 backdrop-blur-xl border-r border-border transform transition-transform duration-500 ease-out md:translate-x-0 flex flex-col shadow-2xl md:shadow-none",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    {/* Top Section */}
                    <div className="p-6">
                        <div className="flex items-center gap-3 mb-10 px-2">
                            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-emerald-100 shadow-sm shadow-emerald-500/10 shrink-0">
                                <Image src={logoSrc} alt="Logo" width={40} height={40} className="object-cover" />
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-xl font-bold tracking-tight text-emerald-600 truncate">Reventory</h1>
                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-40 italic">Business Console</p>
                            </div>
                        </div>

                        <nav className="space-y-1.5 flex-1">
                            {navItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.label}
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-semibold relative group",
                                            isActive
                                                ? "bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/5"
                                                : "text-muted-foreground hover:bg-emerald-50/50 hover:text-emerald-600"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon className={cn("w-4 h-4", isActive ? "text-emerald-600" : "opacity-40 group-hover:opacity-100")} />
                                            <span>{item.label}</span>
                                        </div>
                                        {isActive && (
                                            <ChevronRight className="w-3 h-3 text-emerald-600/40" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-auto p-4 space-y-3">
                        {/* Download App */}
                        <button
                            onClick={() => {
                                const win = window.open('', '_blank');
                                if (win) {
                                    win.document.write(`
                                        <html>
                                            <head>
                                                <title>Download Reventory</title>
                                                <meta name="viewport" content="width=device-width, initial-scale=1">
                                                <script src="https://cdn.tailwindcss.com"></script>
                                                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
                                                <style>body { font-family: 'Inter', sans-serif; }</style>
                                            </head>
                                            <body class="bg-slate-50 flex items-center justify-center min-h-screen p-6">
                                                <div class="${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-[#09090b] text-[#fafafa]' : 'bg-white text-slate-900'} rounded-[2.5rem] shadow-2xl p-10 max-w-sm w-full text-center space-y-8 border ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'border-zinc-800' : 'border-slate-100'}">
                                                    <div class="w-20 h-20 bg-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-emerald-500/20">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
                                                    </div>
                                                    <div class="space-y-2">
                                                        <h2 class="text-2xl font-bold tracking-tight">Get Reventory Mobile</h2>
                                                        <p class="${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-zinc-400' : 'text-slate-500'} text-sm font-medium leading-relaxed">Manage your business inventory and sales on the go.</p>
                                                    </div>
                                                    <div class="grid gap-3">
                                                        <a href="https://apps.apple.com/ng/app/reventory/id6747654868" target="_blank" class="flex items-center justify-center gap-3 bg-emerald-600 text-white py-4 rounded-2xl hover:bg-emerald-700 transition-all font-bold group shadow-lg shadow-emerald-600/10">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="group-hover:scale-110 transition-transform"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.48-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .76-3.27.82-1.31.05-2.31-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.24-1.99 1.1-3.15-1.02.04-2.25.68-2.98 1.54-.65.76-1.22 1.96-1.07 3.08 1.13.08 2.23-.65 2.95-1.47z"/></svg>
                                                            Download for iOS
                                                        </a>
                                                        <div class="flex items-center justify-center gap-3 ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'bg-zinc-900 text-zinc-600 border-zinc-800' : 'bg-slate-100 text-slate-400 border-slate-200'} py-4 rounded-2xl font-bold cursor-not-allowed border">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m19 12-7 7-7-7"/></svg>
                                                            Android (Coming Soon)
                                                        </div>
                                                    </div>
                                                    <button onclick="window.close()" class="text-xs font-bold ${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'text-zinc-600' : 'text-slate-400'} uppercase tracking-widest hover:text-emerald-600 transition-colors pt-4">Close Window</button>
                                                </div>
                                            </body>
                                        </html>
                                    `);
                                    win.document.close();
                                }
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-secondary/50 text-foreground rounded-2xl hover:bg-emerald-600 hover:text-white transition-all group border border-border"
                        >
                            <Smartphone className="w-4 h-4 group-hover:scale-110 transition-transform opacity-40 group-hover:opacity-100" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Get on Mobile</span>
                        </button>

                        {/* Store Section */}
                        <div className="bg-emerald-600 text-white p-4 rounded-[2rem] shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-white/30 transition-all" />
                            <div className="relative flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-sm font-bold border border-white/20 shrink-0">
                                        {company?.name.charAt(0)}
                                    </div>
                                    {/* <div className="min-w-0">
                                        <p className="text-[11px] font-bold truncate leading-tight">{company?.name}</p>
                                        <p className="text-[9px] text-white/60 font-medium uppercase tracking-widest truncate">{company?.industry}</p>
                                    </div> */}
                                </div>
                                <div className="p-1 px-2 rounded-lg bg-white/10 border border-white/10">
                                    <ModeToggle />
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main */}
                <main className="flex-1 min-h-screen md:pl-72">
                    <div className="p-4 md:p-8 lg:p-10 max-w-6xl mx-auto">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.15 }}
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
