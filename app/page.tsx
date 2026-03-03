'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ShoppingCart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Users,
  TrendingUp,
  LayoutDashboard,
  Globe,
  Store,
  Wallet,
  Smartphone,
  Star,
  BarChart3,
  ChevronRight,
  Download,
  Check,
  ArrowUpRight,
  Search,
  AlertCircle,
  FileText,
  Mail,
  Instagram,
  Facebook,
  Twitter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    id: 'dashboard',
    title: 'Smart Dashboard',
    desc: 'See your whole business at a glance — revenue, stock, and activity all in one place.',
    image: '/assets/dashboard.PNG',
    icon: <LayoutDashboard className="w-6 h-6" />,
    color: "bg-blue-500",
    detail: "Real-time updates"
  },
  {
    id: 'inventory',
    title: 'Visual Inventory',
    desc: "Browse, search, and filter every product you stock with photos and real-time levels.",
    image: '/assets/allinventory.PNG',
    icon: <Package className="w-6 h-6" />,
    color: "bg-emerald-500",
    detail: "Photo-first listing"
  },
  {
    id: 'analysis',
    title: 'Business Analytics',
    desc: 'Track top sellers, slow movers, and growth trends without a single spreadsheet.',
    image: '/assets/analysis.PNG',
    icon: <BarChart3 className="w-6 h-6" />,
    color: "bg-indigo-500",
    detail: "Profit insights"
  },
  {
    id: 'staff',
    title: 'Staff Management',
    desc: 'Assign roles and track sales performance for every employee individually.',
    image: '/assets/simpleregistration.PNG',
    icon: <Users className="w-6 h-6" />,
    color: "bg-amber-500",
    detail: "Role-based access"
  },
];

const REVIEWS = [
  {
    name: "Aisha Mohammed",
    role: "Retail Shop Owner",
    text: "Reventory changed everything. I used to spend hours checking books. Now I see everything on my phone instantly.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha"
  },
  {
    name: "Emeka Okoro",
    role: "Wholesale Merchant",
    text: "The multi-staff tracking is the best. I can travel and still see exactly which employee is making sales.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emeka"
  },
  {
    name: "Sarah Johnson",
    role: "Boutique Owner",
    text: "Managing stock for branches was a nightmare. Reventory makes it feel like I'm in three places at once.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  }
];

const COUNTRIES = [
  { code: 'NG', flag: '🇳🇬', label: 'Nigeria', currency: '₦', standard: '2,000', pro: '5,000' },
  { code: 'US', flag: '🇺🇸', label: 'United States', currency: '$', standard: '2.99', pro: '4.99' },
  { code: 'OTHER', flag: '🌍', label: 'Other', currency: '$', standard: '2.99', pro: '4.99' },
];

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [pillsActive, setPillsActive] = useState(0);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white text-[#020617] font-sans selection:bg-blue-100 overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 h-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[11px] font-black tracking-[0.2em] uppercase">
            <a href="#features" className="text-slate-500 hover:text-[#4466B9] transition-colors">Features</a>
            <a href="#pricing" className="text-slate-500 hover:text-[#4466B9] transition-colors">Pricing</a>
            <a href="#download" className="text-slate-500 hover:text-[#4466B9] transition-colors">Download</a>
            <Link href="/auth/login" className="text-slate-900 border-l border-slate-200 pl-10 hover:text-[#4466B9] transition-colors">Log In</Link>
            <Link href="/auth/register" className="px-7 py-3.5 bg-[#4466B9] text-white rounded-xl hover:scale-105 transition-all active:scale-95 shadow-xl shadow-blue-500/10">
              START FREE
            </Link>
          </div>

          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl p-8 flex flex-col gap-6 font-black tracking-widest uppercase text-center"
            >
              <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#pricing" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
              <Link href="/auth/register" className="w-full py-4 bg-[#4466B9] text-white rounded-xl">Get Started Free</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main>
        {/* ── CENTERED HERO ── */}
        <section className="pt-48 pb-32 px-6 text-center bg-white relative">
          <div className="max-w-4xl mx-auto space-y-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black tracking-[0.3em] text-[#4466B9] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#4466B9] animate-pulse" />
              Revolutionizing Retail Inventory
            </div>

            <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase">
              Your entire shop <br />
              <span className="text-[#4466B9]">in your pocket.</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              The smartest, most visual inventory system for shop owners. Track stock, staff, and sales performance in real-time from anywhere.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <Link href="/auth/register" className="w-full sm:w-auto px-12 py-6 bg-[#4466B9] text-white rounded-2xl font-black text-xl hover:scale-105 transition-all active:scale-95 shadow-2xl shadow-blue-500/20 flex items-center gap-3 group">
                START NOW
                <ArrowUpRight strokeWidth={4} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link href="#download" className="w-full sm:w-auto px-12 py-6 bg-slate-50 text-slate-900 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all active:scale-95 border border-slate-200">
                GET THE APP
              </Link>
            </div>

            <div className="pt-16 flex flex-wrap items-center justify-center gap-10 grayscale opacity-30">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Package size={18} /> Inventory</div>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><Users size={18} /> Staffing</div>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><ShoppingCart size={18} /> Sales</div>
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest"><BarChart3 size={18} /> Growth</div>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-blue-50/70 blur-[130px] -z-10 rounded-full" />
        </section>

        {/* ── BENTO FEATURES GRID ── */}
        <section id="features" className="py-40 px-6 lg:px-12 bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-24">
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div className="space-y-6 text-left">
                <span className="text-[#4466B9] font-black tracking-[0.4em] uppercase text-[10px]">Premium Features</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-[0.9]">Built for <br /> Power Users.</h2>
              </div>
              <p className="text-xl text-slate-500 font-medium max-w-lg mb-2">
                We've stripped away the complexity of traditional ERPs. Reventory gives you professional tools with a simple, photo-first interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
              {FEATURES.map((f, idx) => (
                <div key={f.id} className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col h-full relative overflow-hidden">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg", f.color)}>
                    {f.icon}
                  </div>
                  <div className="mt-auto space-y-4 relative z-10">
                    <p className="text-[10px] font-black tracking-widest text-[#4466B9] uppercase">{f.detail}</p>
                    <h3 className="text-2xl font-black tracking-tight uppercase">{f.title}</h3>
                    <p className="text-sm text-slate-500 font-bold leading-relaxed">{f.desc}</p>
                  </div>
                  {/* Background number */}
                  <span className="absolute -bottom-8 -right-4 text-[120px] font-black text-slate-50 opacity-10 select-none group-hover:opacity-20 transition-opacity">0{idx + 1}</span>
                </div>
              ))}
            </div>

            {/* Feature Highlight Mobile Mockup */}
            <div className="pt-12">
              <div className="bg-[#4466B9] rounded-[3.5rem] p-12 lg:p-20 flex flex-col lg:flex-row items-center gap-16 overflow-hidden relative">
                <div className="flex-1 space-y-8 text-white relative z-10">
                  <h3 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-[0.9]">The interface <br /> your staff <br /> will love.</h3>
                  <p className="text-lg text-white/70 font-medium max-w-md">
                    Zero training required. If they can use Instagram, they can use Reventory. Log sales, check stock, and update levels in seconds.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {['Fast Logging', 'Barcode Support', 'Image Uploads', 'Instant Sync'].map(tag => (
                      <span key={tag} className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex justify-center lg:justify-end relative">
                  <div className="w-[260px] md:w-[300px] bg-black p-3 rounded-[2.5rem] shadow-[-20px_40px_80px_rgba(0,0,0,0.5)] border border-white/10 relative z-10">
                    <Image src="/assets/dashboard.PNG" width={300} height={600} alt="Interface" className="rounded-[1.8rem]" />
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 blur-[100px] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <section className="py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center space-y-4 font-black uppercase">
            <h2 className="text-4xl tracking-tight italic">What Shop Owners Say</h2>
          </div>

          <div className="flex relative">
            <motion.div
              className="flex gap-6 px-4 py-4"
              animate={{ x: [0, -1200] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {[...REVIEWS, ...REVIEWS, ...REVIEWS].map((r, i) => (
                <div key={i} className="flex-shrink-0 w-[350px] p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-6">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-slate-600 font-bold leading-relaxed whitespace-normal italic text-lg">"{r.text}"</p>
                  <div className="flex items-center gap-4 border-t border-slate-200 pt-8">
                    <img src={r.avatar} alt={r.name} className="w-12 h-12 rounded-2xl grayscale" />
                    <div>
                      <p className="font-black text-sm uppercase tracking-tighter">{r.name}</p>
                      <p className="text-[10px] font-black text-[#4466B9] uppercase tracking-widest opacity-60">{r.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── PRICING ── */}
        <section id="pricing" className="py-40 px-6 bg-[var(--price-bg)] text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-24 relative z-10">
            <div className="text-center space-y-10">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic">Scale at <br /> Your Pace.</h2>
              <div className="flex justify-center">
                <div className="inline-flex bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
                  {COUNTRIES.map((c, i) => (
                    <button
                      key={c.code}
                      onClick={() => { setSelectedCountry(c); setPillsActive(i); }}
                      className={cn(
                        "px-8 py-4 rounded-xl text-[11px] font-black tracking-widest uppercase transition-all",
                        pillsActive === i ? "bg-white text-black shadow-2xl" : "text-white/40 hover:text-white"
                      )}
                    >
                      {c.flag} {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Starter */}
              <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] space-y-12 flex flex-col hover:bg-white/10 transition-all">
                <div className="space-y-4">
                  <p className="text-[11px] font-black tracking-[0.4em] text-white/40 uppercase">Starter</p>
                  <div className="text-7xl font-black italic">Free</div>
                </div>
                <div className="flex-1 space-y-6 border-t border-white/10 pt-10">
                  {['1 Staff Member', '20 Products', 'Daily Reports', 'Standard Sync', 'Email Support'].map(item => (
                    <div key={item} className="flex items-center gap-4 text-[11px] font-black tracking-widest uppercase opacity-70">
                      <CheckCircle2 size={18} className="text-[#4466B9]" /> {item}
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-2xl text-center font-black tracking-widest hover:bg-white hover:text-black transition-all">START FREE</Link>
              </div>

              {/* Standard */}
              <div className="p-12 bg-white text-black rounded-[3.5rem] space-y-12 flex flex-col shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] z-20 md:scale-[1.08] relative overflow-hidden">
                <div className="absolute top-0 right-10 -translate-y-1/2 bg-[#4466B9] text-white px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase">Best Choice</div>
                <div className="space-y-4">
                  <p className="text-[11px] font-black tracking-[0.4em] text-slate-400 uppercase">Standard</p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black pb-2">{selectedCountry.currency}</span>
                    <span className="text-8xl font-black italic">{selectedCountry.standard}</span>
                    <span className="text-sm font-black opacity-30 pb-4 uppercase">/mo</span>
                  </div>
                </div>
                <div className="flex-1 space-y-6 border-t border-slate-100 pt-10">
                  {['3 Staff Members', '50 Products', 'Advanced Analytics', 'Stock Alerts', '24/7 Priority Chat'].map(item => (
                    <div key={item} className="flex items-center gap-4 text-[11px] font-black tracking-widest uppercase">
                      <CheckCircle2 size={18} className="text-[#4466B9]" /> {item}
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" className="w-full py-7 bg-[#4466B9] text-white rounded-2xl text-center font-black tracking-widest shadow-2xl shadow-blue-500/30 active:scale-95 transition-all">UPGRADE NOW</Link>
              </div>

              {/* Professional */}
              <div className="p-12 bg-white/5 border border-white/10 rounded-[3rem] space-y-12 flex flex-col hover:bg-white/10 transition-all">
                <div className="space-y-4">
                  <p className="text-[11px] font-black tracking-[0.4em] text-white/40 uppercase">Professional</p>
                  <div className="flex items-end gap-1 text-white">
                    <span className="text-3xl font-black pb-2">{selectedCountry.currency}</span>
                    <span className="text-7xl font-black italic">{selectedCountry.pro}</span>
                    <span className="text-sm font-black opacity-30 pb-4 uppercase">/mo</span>
                  </div>
                </div>
                <div className="flex-1 space-y-6 border-t border-white/10 pt-10">
                  {['5 Staff', 'Unlimited Products', 'Multi-Branch Support', 'Custom Branding', 'dedicated manager'].map(item => (
                    <div key={item} className="flex items-center gap-4 text-[11px] font-black tracking-widest uppercase opacity-70">
                      <CheckCircle2 size={18} className="text-[#4466B9]" /> {item}
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" className="w-full py-6 bg-white/5 border border-white/10 text-white rounded-2xl text-center font-black tracking-widest hover:bg-white hover:text-black transition-all">CONTACT US</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── DOWNLOAD — MINIMAL ── */}
        <section id="download" className="py-48 px-6 bg-white border-t border-slate-100 relative overflow-hidden">
          <div className="max-w-4xl mx-auto text-center space-y-20 relative z-10">
            <div className="space-y-4">
              <span className="text-[#4466B9] font-black tracking-[0.4em] uppercase text-[10px]">Ready to sync?</span>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none italic">Control at <br /> your Fingertips.</h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                href="/download/direct-apple"
                className="w-full sm:w-[260px] h-[80px] bg-black rounded-2xl flex items-center justify-center gap-5 hover:scale-105 transition-all shadow-2xl group"
              >
                <Download size={28} className="text-white group-hover:animate-bounce" />
                <div className="text-left text-white leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Download for</p>
                  <p className="text-2xl font-black tracking-tight">iOS</p>
                </div>
              </Link>

              <Link
                href="/download/direct-google"
                className="w-full sm:w-[260px] h-[80px] bg-[#4466B9] rounded-2xl flex items-center justify-center gap-5 hover:scale-105 transition-all shadow-2xl group"
              >
                <Smartphone size={28} className="text-white group-hover:scale-110 transition-transform" />
                <div className="text-left text-white leading-tight">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Get it on</p>
                  <p className="text-2xl font-black tracking-tight">Android</p>
                </div>
              </Link>
            </div>

            <div className="pt-20 flex gap-12 items-center justify-center grayscale opacity-10">
              <Globe size={32} /><Smartphone size={32} /><ShieldCheck size={32} /><LayoutDashboard size={32} /><TrendingUp size={32} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-slate-50/50 -z-10 skew-y-6 translate-y-20" />
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="pt-32 pb-20 px-6 lg:px-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">

            {/* Branding Column */}
            <div className="lg:col-span-2 space-y-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#4466B9] rounded-2xl shadow-lg border border-white/20"></div>
                <span className="text-3xl font-black tracking-tighter uppercase">REVENTORY</span>
              </div>
              <p className="text-slate-500 font-bold text-lg leading-relaxed max-w-sm">
                Professional-grade inventory management for modern merchants. Built for simplicity, designed for growth.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-[#4466B9] hover:border-[#4466B9] transition-all shadow-sm">
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="space-y-8">
              <h4 className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">Product</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
                <li><a href="#features" className="text-slate-600 hover:text-black transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-slate-600 hover:text-black transition-colors">Pricing</a></li>
                <li><a href="#download" className="text-slate-600 hover:text-black transition-colors">Mobile App</a></li>
                <li><a href="/auth/register" className="text-[#4466B9]">Free Trial</a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">Support</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
                <li><Link href="/help" className="text-slate-600 hover:text-[#4466B9] transition-colors">Help Center</Link></li>
                <li><Link href="/guides" className="text-slate-600 hover:text-[#4466B9] transition-colors">Guides</Link></li>
                <li><Link href="/contact" className="text-slate-600 hover:text-[#4466B9] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[11px] font-black tracking-[0.3em] uppercase text-slate-400">Legal</h4>
              <ul className="space-y-4 text-sm font-bold uppercase tracking-widest">
                <li><Link href="/privacy" className="text-slate-600 hover:text-[#4466B9] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-slate-600 hover:text-[#4466B9] transition-colors">Terms of Use</Link></li>
                <li><Link href="/security" className="text-slate-600 hover:text-[#4466B9] transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              © 2026 Reventory System · All Rights Reserved
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Network Active</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black text-slate-300 uppercase tracking-widest">
              <span>Designed with ❤️ for Shops</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
