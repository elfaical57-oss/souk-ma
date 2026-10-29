import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConditionalShell from "@/components/layout/ConditionalShell";
import { Toaster } from "@/components/ui/Toaster";
import AuthInit from "@/components/AuthInit";
import SupplierPopup from "@/components/SupplierPopup";

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
  adjustFontFallback: true,
});

const BASE_URL = "https://jemlamaroc.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F04444",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  manifest: "/manifest.json",
  title: {
    default: "JemlaMaroc - Grossiste au Maroc | Achat en Gros Direct Fournisseur",
    template: "%s | JemlaMaroc",
  },
  description:
    "JemlaMaroc, la marketplace de vente en gros au Maroc. Achetez en gros - mode, alimentation, électronique, artisanat - directement auprès de fournisseurs partout au Maroc.",
  keywords: [
    "achat en gros maroc", "fournisseurs maroc", "prix de gros maroc",
    "grossiste maroc", "vente en gros maroc", "revendeur maroc",
    "commande en gros maroc", "fournisseur direct maroc",
    "grossiste alimentation maroc", "grossiste mode maroc",
    "grossiste electronique maroc", "grossiste artisanat maroc",
    "marché de gros maroc", "particuliers gros maroc",
    "جملة المغرب", "موردون المغرب", "سوق الجملة المغرب", "شراء بالجملة المغرب",
  ],
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: BASE_URL,
    siteName: "JemlaMaroc",
    title: "JemlaMaroc - Grossiste au Maroc | Achat en Gros Direct Fournisseur",
    description:
      "Plateforme de vente en gros au Maroc, partout au pays. Pour particuliers, revendeurs et professionnels - commandez en gros directement via WhatsApp.",
  },
  twitter: {
    card: "summary_large_image",
    title: "JemlaMaroc - Grossiste au Maroc | Achat en Gros Direct Fournisseur",
    description:
      "Plateforme de vente en gros au Maroc. Particuliers et revendeurs bienvenus - commandez en gros via WhatsApp.",
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
  description: "Plateforme d'achat en gros au Maroc - fournisseurs pour particuliers, revendeurs et professionnels.",
  address: { "@type": "PostalAddress", addressCountry: "MA" },
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@jemlamaroc.com",
    telephone: "+212629268642",
    contactType: "customer service",
  },
  sameAs: [
    "https://www.facebook.com/share/1D5LBB6cK1/?mibextid=wwXIfr",
    "https://www.instagram.com/jemlamaroc_officiel",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JemlaMaroc",
  url: BASE_URL,
  description: "Achat en gros au Maroc - mode, alimentation, électronique, artisanat. Pour particuliers, revendeurs et professionnels.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/products?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const marketplaceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Store",
  name: "JemlaMaroc",
  url: BASE_URL,
  description: "Marché de gros en ligne au Maroc. Achetez directement auprès de fournisseurs, partout au pays.",
  address: { "@type": "PostalAddress", addressCountry: "MA" },
  priceRange: "MAD",
  currenciesAccepted: "MAD",
  paymentAccepted: "Cash, WhatsApp Order",
  areaServed: "MA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <Script id="lang-flash-guard" strategy="beforeInteractive">
          {`
            try {
              var raw = localStorage.getItem("jemla-lang");
              var lang = raw && JSON.parse(raw).state && JSON.parse(raw).state.lang;
              if (lang === "ar") {
                document.documentElement.lang = "ar";
                document.documentElement.dir = "rtl";
              }
            } catch (e) {}
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(marketplaceJsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${notoArabic.variable}`}>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1866798688625455"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
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
        <Script id="meta-pixel" strategy="lazyOnload">
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
        <SupplierPopup />
        <ConditionalShell>{children}</ConditionalShell>
        <Toaster />
      </body>
    </html>
  );
}
