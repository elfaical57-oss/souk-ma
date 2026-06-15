"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

const NO_SHELL_ROUTES = ["/login", "/register", "/dashboard/admin"];
const NO_BOTTOM_NAV   = ["/login", "/register", "/dashboard"];

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShell     = NO_SHELL_ROUTES.some((r) => pathname.startsWith(r));
  const noBottomNav = NO_BOTTOM_NAV.some((r) => pathname.startsWith(r));

  if (noShell) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className={`min-h-screen ${noBottomNav ? "" : "pb-16 md:pb-0"}`}>
        {children}
      </main>
      <Footer />
      {!noBottomNav && <BottomNav />}
    </>
  );
}
