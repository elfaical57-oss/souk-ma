import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
import AuthInit from "@/components/AuthInit";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
  preload: false,
});

const BASE_URL = "https://jemlamaroc.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JemlaMaroc — Les meilleurs prix de gros au Maroc",
    template: "%s | JemlaMaroc",
  },
  description:
    "Marketplace B2B de gros au Maroc. Achetez et vendez en gros — alimentation, électronique, mode, artisanat et plus. Des milliers de produits de vendeurs vérifiés.",
  keywords: [
    "marketplace maroc", "prix de gros maroc", "grossiste maroc",
    "جملة المغرب", "سوق الجملة المغرب", "acheter en gros maroc",
    "vendre en gros maroc", "vendeurs vérifiés maroc",
  ],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: BASE_URL,
    siteName: "JemlaMaroc",
    title: "JemlaMaroc — Les meilleurs prix de gros au Maroc",
    description:
      "Marketplace B2B de gros au Maroc. Des milliers de produits de vendeurs vérifiés.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JemlaMaroc — Les meilleurs prix de gros au Maroc",
    description:
      "Marketplace B2B de gros au Maroc. Des milliers de produits de vendeurs vérifiés.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: BASE_URL },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JemlaMaroc",
  url: BASE_URL,
  description: "Marketplace B2B de gros au Maroc",
  address: { "@type": "PostalAddress", addressCountry: "MA" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${notoArabic.variable}`}>
        <AuthInit />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
