import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2849] via-[#1a3f72] to-[#0d3461] flex flex-col">
      {/* Minimal header — logo only */}
      <header className="flex justify-center pt-8 pb-4">
        <Link href="/">
          <Image src="/logo.png" alt="JemlaMaroc" width={160} height={50} className="h-12 w-auto object-contain" priority />
        </Link>
      </header>

      {/* Auth card */}
      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <footer className="text-center text-blue-300/50 text-xs py-6">
        © {new Date().getFullYear()} JemlaMaroc — Tous droits réservés
      </footer>
    </div>
  );
}
