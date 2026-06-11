import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalShell from "@/components/layout/ConditionalShell";
import { Toaster } from "@/components/ui/Toaster";
import AuthInit from "@/components/AuthInit";

const GA_ID = "G-C238ZFKZLF";
const META_PIXEL_ID = "1337494121336048";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JemlaMaroc — Fournisseurs & Prix de Gros au Maroc",
    template: "%s | JemlaMaroc",
  },
  description:
    "Trouvez les meilleurs fournisseurs et prix de gros au Maroc. Alimentation, mode, électronique, artisanat — des milliers de produits de fournisseurs vérifiés, livraison partout au Maroc.",
  keywords: [
    "fournisseurs maroc", "prix de gros maroc", "grossiste maroc",
    "marketplace maroc", "achat en gros maroc", "vente en gros maroc",
    "fournisseur alimentation maroc", "fournisseur mode maroc",
    "جملة المغرب", "موردون المغرب", "سوق الجملة المغرب",
  ],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: BASE_URL,
    siteName: "JemlaMaroc",
    title: "JemlaMaroc — Fournisseurs & Prix de Gros au Maroc",
    description:
      "Trouvez les meilleurs fournisseurs et prix de gros au Maroc. Des milliers de produits vérifiés, livraison partout au Maroc.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JemlaMaroc — Fournisseurs & Prix de Gros au Maroc",
    description:
      "Trouvez les meilleurs fournisseurs et prix de gros au Maroc. Des milliers de produits vérifiés.",
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
  description: "Trouvez les meilleurs fournisseurs et prix de gros au Maroc.",
  address: { "@type": "PostalAddress", addressCountry: "MA" },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JemlaMaroc",
  url: BASE_URL,
  description: "Fournisseurs & prix de gros au Maroc — alimentation, mode, électronique, artisanat.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${notoArabic.variable}`}>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
            n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
            s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <AuthInit />
        <ConditionalShell>{children}</ConditionalShell>
        <Toaster />
      </body>
    </html>
  );
}
