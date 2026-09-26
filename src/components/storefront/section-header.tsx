import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  eyebrow?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  eyebrow,
  action,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-6 flex flex-col gap-3 text-left sm:flex-row sm:items-end sm:justify-between ${className}`}
    >
      <div className="flex max-w-2xl flex-col gap-1.5">
        {eyebrow}
        <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
