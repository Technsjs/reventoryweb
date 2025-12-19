import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
