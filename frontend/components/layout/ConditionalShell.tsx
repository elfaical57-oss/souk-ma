"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const NO_SHELL_ROUTES = ["/login", "/register", "/dashboard/admin"];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShell = NO_SHELL_ROUTES.some((r) => pathname.startsWith(r));

  if (noShell) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
