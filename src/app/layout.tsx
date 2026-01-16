
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

export const dynamic = 'force-dynamic'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3B82F6'
};

export const metadata: Metadata = {
  title: "Opus Zero",
  description: "Unified platform for live entertainment production and operations",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Opus Zero",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Opus Zero",
    title: "Opus Zero",
    description: "Unified platform for live entertainment production and operations",
  },
  twitter: {
    card: "summary",
    title: "Opus Zero",
    description: "Unified platform for live entertainment production and operations",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-brand="atlvs" data-brand-mode="branded">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png"/>
        <link rel="icon" href="/favicon.ico"/>
        <meta name="application-name" content="Opus Zero"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="Opus Zero"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="msapplication-TileColor" content="#3B82F6"/>
        <meta name="msapplication-config" content="/browserconfig.xml"/>
      </head>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] font-['Share_Tech',_sans-serif]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
