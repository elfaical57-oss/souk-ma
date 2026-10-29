"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectDropdownOption {
  value: string;
  label: string;
}

export default function SelectDropdown({
  value,
  onChange,
  options,
  icon,
  ariaLabel,
  triggerClassName = "",
  menuClassName = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectDropdownOption[];
  icon?: ReactNode;
  ariaLabel?: string;
  triggerClassName?: string;
  menuClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = options.find((o) => o.value === value) ?? options[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={`flex h-14 w-full items-center gap-3 rounded-xl px-4 text-start text-sm outline-none transition-shadow ${triggerClassName}`}
      >
        {icon}
        <span className="min-w-0 flex-1 truncate">{current?.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute z-50 mt-2 max-h-72 w-full min-w-[200px] overflow-y-auto rounded-xl border border-slate-100 bg-white p-1.5 shadow-xl shadow-slate-900/10 ${menuClassName}`}
        >
          {options.map((opt) => {
            const selected = opt.value === value;
            return (
              <li key={opt.value || "__all__"}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`block w-full truncate rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                    selected ? "bg-blue-50 font-semibold text-blue-600" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
