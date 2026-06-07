import type { Metadata } from "next";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/Toaster";
import AuthInit from "@/components/AuthInit";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoArabic = Noto_Sans_Arabic({ subsets: ["arabic"], variable: "--font-noto-arabic" });

export const metadata: Metadata = {
  title: "JemlaMaroc — المتجر الإلكتروني المغربي",
  description: "Marketplace en ligne pour le Maroc — متجر إلكتروني للمغرب",
  keywords: ["maroc", "marketplace", "jemla", "المغرب", "جملة", "acheter", "vendre"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
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
