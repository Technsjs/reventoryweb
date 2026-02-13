import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: "Reventory - Smart Inventory Management for Nigerian Shop Owners",
  description: "Replace notebooks and WhatsApp with Reventory. Track inventory, manage sales, monitor profits, and hold workers accountable. Free to start, perfect for Nigerian businesses.",
  keywords: "inventory management, sales tracking, Nigeria, shop management, worker management, stock tracking, business analytics",
  openGraph: {
    title: "Reventory - Smart Inventory Management",
    description: "The smarter way to manage your shop's inventory and sales",
    type: "website",
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
