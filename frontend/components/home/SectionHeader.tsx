import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel,
}: {
  title: string;
  subtitle: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-navy tracking-tight">{title}</h2>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      {href && linkLabel && (
        <Link
          href={href}
          className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-navy hover:text-accent transition-colors shrink-0"
        >
          {linkLabel}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
