import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';
import Script from "next/script";

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
title: "Reventory – Inventory & Sales App for Small Shops",  
  description: "Replace notebooks with Reventory. Track inventory, record sales, manage staff, and grow your business from one clean app. Free to start.",
  keywords: "real-time inventory tracking, multi-user inventory app, small business sales tracker, product stock alerts, shop management software Nigeria, inventory and profit tracking app",
  openGraph: {
    title: "Reventory - Smart Shop Management",
    description: "The smarter way to manage your shop's inventory, sales, and team.",
    type: "website",
    url: "https://reventory.briconnix.com",
    locale: "en_US",
    siteName: "Reventory",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reventory - Smart Shop Management",
    description: "Track inventory, manage staff, record sales, and grow your shop with Reventory.",
    site: "@YourTwitterHandle",
  },
};

import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${jakarta.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}



<Script id="reventory-schema" type="application/ld+json" strategy="afterInteractive">
{`
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Reventory",
  "operatingSystem": "iOS, Android",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "NGN",
    "url": "https://play.google.com/store/apps/details?id=com.reventory.app"
  },
  "url": "https://reventory.briconnix.com",
  "description": "Reventory helps small shops track products, record sales, manage staff, and get notifications on stock."
}
`}
</Script>