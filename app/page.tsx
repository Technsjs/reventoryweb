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
  Sparkles,
  Heart,
  Store,
  Wallet,
  Smartphone,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-700 font-sans selection:bg-primary/20">

      {/* Warm & Welcoming Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-border transition-all">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center overflow-hidden shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
              <Image
                src="https://res.cloudinary.com/dijhekwvl/image/upload/v1766146257/IMG_9619_ilwzns.jpg"
                alt="Logo"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">Reventory</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-wider">
            <a href="#features" className="text-foreground/60 hover:text-primary transition-all">How it works</a>
            <a href="#pricing" className="text-foreground/60 hover:text-primary transition-all">Pricing</a>
            <div className="h-4 w-[1px] bg-border" />
            <a
              href="#"
              className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-all"
            >
              <Smartphone className="w-4 h-4" />
              Download App
            </a>
            <Link href="/auth/login" className="text-foreground/60 hover:text-primary transition-all">Sign In</Link>
            <Link
              href="/auth/register"
              className="px-8 py-3.5 bg-foreground text-background rounded-2xl shadow-lg shadow-black/5 hover:opacity-90 transition-all flex items-center gap-3 active:scale-95"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button className="text-foreground p-2 bg-secondary rounded-xl transition-all active:scale-95" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="container mx-auto px-6 py-10 flex flex-col gap-8 font-bold text-lg">
                <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-foreground/60 hover:text-primary transition-all">How it works</a>
                <a href="#pricing" onClick={() => setIsMenuOpen(false)} className="text-foreground/60 hover:text-primary transition-all">Pricing</a>
                <a href="#" className="flex items-center gap-3 text-foreground/60 hover:text-primary transition-all">
                  <Smartphone className="w-5 h-5" />
                  Download App
                </a>
                <Link href="/auth/login" className="text-foreground/60 hover:text-primary transition-all">Sign In</Link>
                <Link
                  href="/auth/register"
                  className="w-full py-5 bg-foreground text-background rounded-2xl shadow-xl shadow-black/5 flex items-center justify-center gap-3 active:scale-95"
                >
                  Start for free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-20">

        {/* Human-Centric Hero Section */}
        <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)]" />

          <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-10 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs border border-brand-teal/20 backdrop-blur-sm">
                <Star className="w-4 h-4 fill-brand-teal" />
                Trusted by 100+ Merchants in Nigeria
              </div>

              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-foreground">
                Manage your shop <br />
                <span className="text-primary">with confidence.</span>
              </h1>

              <p className="text-foreground/60 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Stop worrying about missing stock and money. Track your sales, manage your staff, and watch your business grow—all from the palm of your hand.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-10 py-5 bg-foreground text-background rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-black/5"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-slate-100 overflow-hidden shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 567}`} alt="Merchant" />
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-medium text-foreground/40">Growing Daily</div>
                </div>
              </div>

              <div className="flex items-center gap-8 pt-8 opacity-50 grayscale hover:grayscale-0 transition-all cursor-default font-medium text-sm">
                <span>Lagos</span>
                <span>Abuja</span>
                <span>Port Harcourt</span>
                <span>Ibadan</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative lg:h-[700px] flex items-center justify-center"
            >
              <div className="relative w-full aspect-square md:aspect-auto md:h-full max-w-lg lg:max-w-none group">
                <div className="absolute -inset-10 bg-gradient-to-tr from-primary/10 via-brand-teal/5 to-transparent rounded-full blur-3xl animate-pulse" />

                {/* Human Hero Image */}
                <div className="relative h-full w-full rounded-[4rem] overflow-hidden shadow-2xl border-8 border-background group-hover:scale-[1.02] transition-transform duration-700">
                  <Image
                    src="/assets/hero.png"
                    alt="Vibrant Nigerian Shop Owner"
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Dynamic Elements */}
                <div className="absolute top-20 -left-12 bg-card p-6 rounded-[32px] shadow-2xl border border-border animate-float opacity-0 lg:opacity-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Today's Profit</p>
                      <p className="text-xl font-bold text-foreground">₦24,500</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-20 -right-12 bg-card p-6 rounded-[32px] shadow-2xl border border-border animate-float [animation-delay:2s] opacity-0 lg:opacity-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground/40 uppercase tracking-widest">Low Stock</p>
                      <p className="text-xl font-bold text-foreground">5 Items Left</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid - Descriptive & Inviting */}
        <section id="features" className="py-32 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center space-y-4 mb-24">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Tools for your shop's <br /> success</h2>
              <p className="text-foreground/40 text-lg font-medium">Simple yet powerful. No training needed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <FeatureCard
                icon={<Store className="w-10 h-10 text-primary" />}
                title="Stock Tracking"
                desc="Know exactly what's left in your shop. Get automatic alerts when products are running low so you can restock in time."
                bg="bg-indigo-50"
              />
              <FeatureCard
                icon={<Smartphone className="w-10 h-10 text-brand-teal" />}
                title="Sales Records"
                desc="Record sales instantly from your phone. Even if you have multiple workers, everything is synced to one central account."
                bg="bg-teal-50"
              />
              <FeatureCard
                icon={<Users className="w-10 h-10 text-brand-amber" />}
                title="Staff Monitor"
                desc="Hold your workers accountable. See who sold what, when they sold it, and ensure every Naira is accounted for."
                bg="bg-amber-50"
              />
              <FeatureCard
                icon={<Zap className="w-10 h-10 text-indigo-500" />}
                title="Smart Alerts"
                desc="Get real-time notifications for low stock, sales milestones, and staff activity so you're always in the loop."
                bg="bg-indigo-50"
              />
              <FeatureCard
                icon={<TrendingUp className="w-10 h-10 text-emerald-500" />}
                title="Business Insights"
                desc="Understand your shop better with automatic reports on best-sellers and peak hours. Grow with data, not guesses."
                bg="bg-emerald-50"
              />
              <FeatureCard
                icon={<Globe className="w-10 h-10 text-sky-500" />}
                title="Multi-Device Sync"
                desc="Access your shop hub from anywhere. Your data is safely backed up and synced across laptops, tablets, and phones."
                bg="bg-sky-50"
              />
            </div>
          </div>
        </section>

        {/* Pricing - Clear & Direct */}
        <section id="pricing" className="py-32 bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent" />

          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-24 space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-foreground">Plans That Scale With You</h2>
              <p className="text-foreground/40 text-lg font-medium">Try any plan for free. No credit card required.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <PricingBox
                name="Starter"
                price="Free"
                desc="One shop, one mission."
                features={['1 Working Staff', '20 Products Max', 'Daily Summary']}
                btnText="Go Free"
              />
              <PricingBox
                name="Standard"
                price="₦2,000"
                desc="For growing businesses."
                popular
                features={['2 Working Staff', '50 Products Max', 'Printable Reports', 'Priority Chat Support']}
                btnText="Start Standard"
              />
              <PricingBox
                name="Pro"
                price="₦5,000"
                desc="The complete command center."
                features={['5 Working Staff', 'Unlimited Products', 'Advanced Analytics', 'Multi-Branch Support']}
                btnText="Go Professional"
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-5xl bg-foreground text-background rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Sparkles className="w-64 h-64" />
            </div>
            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Ready to take control?</h2>
              <p className="text-background/70 text-lg md:text-xl max-w-2xl mx-auto">Join hundreds of Nigerian shop owners who have retired their notebooks for Reventory.</p>
              <Link
                href="/auth/register"
                className="inline-flex px-12 py-5 bg-background text-foreground rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl active:scale-95"
              >
                Create Your Free Shop
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-background border-t border-border py-16 px-6">
        <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Store className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">Reventory</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-foreground/60">
            <Link href="/auth/login" className="hover:text-primary transition-colors">Sign In</Link>
            <Link href="/auth/register" className="hover:text-primary transition-colors">Register Shop</Link>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
            <a href="mailto:hello@reventory.com" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <p className="text-sm font-medium text-foreground/40 text-center md:text-right">© 2026 Reventory. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, bg }: any) {
  return (
    <div className="p-10 bg-card rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 space-y-6 group">
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300", bg)}>
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
        <p className="text-foreground/60 leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}

function PricingBox({ name, price, desc, features, btnText, popular }: any) {
  return (
    <div className={cn(
      "p-12 rounded-[4rem] border relative flex flex-col items-center text-center transition-all duration-500",
      popular ? "bg-card border-primary shadow-2xl scale-[1.05] z-10" : "bg-card/50 border-border hover:border-primary/20 shadow-sm"
    )}>
      {popular && (
        <div className="absolute -top-5 px-6 py-2 bg-primary text-blue text-xs font-semibold tracking-tight rounded-full shadow-lg">
          Best Value
        </div>
      )}
      <div className="space-y-3 mb-10">
        <h4 className="text-xs font-bold tracking-tight text-foreground/40">{name}</h4>
        <div className="text-5xl font-bold tracking-tight text-foreground">{price}</div>
        <p className="text-foreground/60 font-medium text-sm">{desc}</p>
      </div>
      <div className="flex-1 space-y-6 w-full mb-12">
        {features.map((f: string, i: number) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-secondary justify-center">
            <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", popular ? "text-primary" : "text-foreground/20")} />
            <span className="text-sm font-semibold tracking-tight text-foreground/70">{f}</span>
          </div>
        ))}
      </div>
      <Link
        href="/auth/register"
        className={cn(
          "w-full py-5 rounded-2xl font-bold text-sm transition-all active:scale-95 text-center",
          popular ? "bg-foreground text-background shadow-xl shadow-black/5" : "bg-secondary text-foreground hover:bg-foreground hover:text-background"
        )}
      >
        {btnText}
      </Link>
    </div>
  );
}
