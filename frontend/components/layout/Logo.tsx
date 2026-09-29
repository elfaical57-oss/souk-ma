import Link from "next/link";
import { cn } from "@/lib/cn";

export default function Logo({
  compact = false,
  onDark = false,
}: {
  compact?: boolean;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      className="shrink-0 flex flex-col justify-center rounded-lg px-0.5"
      aria-label="JemlaMaroc — accueil"
    >
      <span className={cn("font-extrabold tracking-tight leading-none", compact ? "text-lg" : "text-[1.35rem]")}>
        <span className={onDark ? "text-white" : "text-navy"}>Jemla</span>
        <span className="text-accent">Maroc</span>
      </span>
      {!compact && (
        <span
          className={cn(
            "text-[9px] font-medium tracking-[0.16em] uppercase hidden sm:block leading-none mt-1",
            onDark ? "text-blue-200/70" : "text-slate-500"
          )}
        >
          Le marché B2B du Maroc
        </span>
      )}
    </Link>
  );
}
