import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const SECTIONS = [
    {
        title: "1. Acceptance of Terms",
        body: `By accessing or using Reventory ("the Service"), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this Service.`
    },
    {
        title: "2. Use of the Service",
        body: `You may use Reventory for your lawful business inventory and sales tracking purposes. You agree not to:

• Use the Service for any unlawful purpose or in any way that violates these Terms.
• Upload false, misleading, or infringing content.
• Attempt to gain unauthorized access to any part of the Service.
• Engage in any conduct that restricts or inhibits any other user's enjoyment of the Service.
• Reverse engineer, decompile, or disassemble any part of the Service.`
    },
    {
        title: "3. Account Responsibility",
        body: `You are responsible for maintaining the security of your account credentials. You agree to notify us immediately at support@reventory.app of any unauthorized use of your account. Reventory will not be liable for any losses arising from unauthorized use of your account.`
    },
    {
        title: "4. Subscription & Billing",
        body: `Certain features of Reventory require a paid subscription. By subscribing:

• You authorize us to charge your payment method on a recurring basis.
• Subscriptions auto-renew unless cancelled at least 24 hours before the renewal date.
• Refunds are issued at our discretion within 7 days of purchase for first-time subscribers who experienced a technical issue preventing use of the Service.`
    },
    {
        title: "5. Intellectual Property",
        body: `All content, features, and functionality of the Service — including text, graphics, logos, icons, and software — are the exclusive property of Reventory and are protected by copyright, trademark, and other intellectual property laws.`
    },
    {
        title: "6. Disclaimer of Warranties",
        body: `The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. Reventory does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.`
    },
    {
        title: "7. Limitation of Liability",
        body: `To the maximum extent permitted by law, Reventory shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits or data, arising from your use of the Service.`
    },
    {
        title: "8. Termination",
        body: `We reserve the right to suspend or terminate your account at any time for violating these Terms, or for any other reason at our sole discretion. Upon termination, your right to use the Service will immediately cease.`
    },
    {
        title: "9. Governing Law",
        body: `These Terms shall be governed by and interpreted in accordance with the laws of the Federal Republic of Nigeria. Any disputes shall be subject to the exclusive jurisdiction of courts located in Nigeria.`
    },
    {
        title: "10. Contact",
        body: `For questions about these Terms, contact us at support@reventory.app.`
    },
];

export default function Terms() {
    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans">

            <div className="bg-[var(--price-bg)] text-white px-6 py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Terms of Use</h1>
                        <p className="text-white/40 font-black uppercase tracking-widest text-[10px] mt-4">Last Updated: March 2026</p>
                    </div>
                    <p className="text-white/50 font-bold text-lg max-w-xl">The rules that govern your use of Reventory. Please read them carefully before using our service.</p>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4466B9]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-24 space-y-6">
                {SECTIONS.map((section) => (
                    <div key={section.title} className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-tight">{section.title}</h2>
                        <p className="text-slate-600 font-bold leading-relaxed whitespace-pre-line">{section.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
