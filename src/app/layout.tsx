
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import "./globals.css";

const schemaOrg = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ATLVS",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD"
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    ratingCount: "150"
  }
}

export const dynamic = 'force-dynamic'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#3B82F6'
};

export const metadata: Metadata = {
  metadataBase: new URL("https://atlvs.one"),
  title: "ATLVS | Live Entertainment Operations Platform | Production Management Software",
  description:
    "ATLVS is the complete live entertainment operations platform trusted by production companies, festivals, and experiential agencies. Manage crews, productions, and audiences from one unified ecosystem. Free to start.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ATLVS",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ATLVS",
    title: "ATLVS | Live Entertainment Operations Platform",
    description: "The complete production management platform for live entertainment. From 50-person crews to 400K+ attendee festivals.",
    url: "https://atlvs.one",
  },
  twitter: {
    card: "summary_large_image",
    title: "ATLVS | Live Entertainment Operations Platform",
    description: "The complete production management platform for live entertainment. From 50-person crews to 400K+ attendee festivals.",
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
        <meta name="application-name" content="ATLVS"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
        <meta name="apple-mobile-web-app-title" content="ATLVS"/>
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="msapplication-TileColor" content="#3B82F6"/>
        <meta name="msapplication-config" content="/browserconfig.xml"/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />
      </head>
      <body className="antialiased bg-[var(--bg-primary)] text-[var(--text-primary)] font-['Share_Tech',_sans-serif]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
