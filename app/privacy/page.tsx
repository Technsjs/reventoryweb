import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const SECTIONS = [
    {
        title: "1. Information We Collect",
        body: `We collect information you provide directly to us when you create an account, use our services, or contact our support team. This includes:

• Account information: your name, business name, email address, and password.
• Business data: products you add, sales you record, staff members you invite, and usage activity within the app.
• Device information: device model, operating system, unique device identifiers, and mobile network information.
• Log data: IP addresses, browser type, pages visited, and timestamps of actions.`
    },
    {
        title: "2. How We Use Your Information",
        body: `We use the information we collect to:

• Provide, maintain, and improve our services.
• Process transactions and send related information.
• Send you technical notices and support messages.
• Respond to your comments, questions, and requests.
• Monitor and analyze trends and usage to improve your experience.
• Detect, investigate, and prevent fraudulent transactions and other illegal activities.`
    },
    {
        title: "3. How We Share Your Information",
        body: `We do not sell your personal data. We may share your information only in the following limited circumstances:

• With service providers (e.g., cloud hosting, analytics) bound by strict confidentiality obligations.
• If required by law or to protect the rights, property, or safety of Reventory or its users.
• With your consent, or at your direction.`
    },
    {
        title: "4. Data Retention",
        body: `We retain your account and business data for as long as your account is active, or as needed to provide services. You may request deletion of your account and associated data at any time by contacting support@reventory.app.`
    },
    {
        title: "5. Security",
        body: `We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. All data is encrypted in transit (TLS) and at rest. Our infrastructure is hosted on enterprise-grade cloud platforms with 24/7 monitoring.`
    },
    {
        title: "6. Your Rights",
        body: `Depending on your location, you may have rights regarding your personal data, including:

• The right to access, correct, or delete your data.
• The right to object to or restrict processing of your data.
• The right to data portability.

To exercise any of these rights, contact us at support@reventory.app.`
    },
    {
        title: "7. Changes to This Policy",
        body: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice in the app or sending you an email. Your continued use of Reventory after the change is effective constitutes your acceptance of the new policy.`
    },
    {
        title: "8. Contact",
        body: `If you have any questions about this Privacy Policy, please contact us at:

Email: support@reventory.app
Address: Reventory Ltd, Nigeria`
    },
];

export default function Privacy() {
    return (
        <div className="min-h-screen bg-white text-[#020617] font-sans">

            <div className="bg-[var(--price-bg)] text-white px-6 py-20 relative overflow-hidden">
                <div className="max-w-4xl mx-auto space-y-6 relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white font-black text-[10px] uppercase tracking-widest transition-colors">
                        <ArrowLeft size={14} /> Back to Home
                    </Link>
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Privacy Policy</h1>
                        <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Last Updated: March 2026</p>
                    </div>
                    <p className="text-white/50 font-bold text-lg max-w-xl">We take your privacy seriously. Here's exactly what we collect, why, and how we protect it.</p>
                </div>
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#4466B9]/20 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
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
