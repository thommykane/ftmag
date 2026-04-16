import type { ReactNode } from "react";

type Props = {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  dense?: boolean;
};

export function Panel({ title, subtitle, children, className = "", dense }: Props) {
  return (
    <section className={`ftmag-panel rounded-lg ${dense ? "p-3" : "p-4"} animate-panel-in ${className}`}>
      {(title || subtitle) && (
        <header className="mb-3 border-b border-[#6e0f1f]/45 pb-2">
          {title && (
            <h2 className="text-sm font-normal uppercase tracking-[0.28em] text-white/95">{title}</h2>
          )}
          {subtitle && <p className="mt-1 text-xs tracking-wide text-white/55">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  );
}
