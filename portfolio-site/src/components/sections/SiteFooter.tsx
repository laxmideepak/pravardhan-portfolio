interface SiteFooterProps {
  name: string;
  email: string;
}

export function SiteFooter({ name, email }: SiteFooterProps) {
  return (
    <footer className="section-shell border-t border-[var(--line)] py-7">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2 text-sm text-[var(--muted)]">
        <p className="font-medium text-[var(--ink)]">{name}</p>
        <a href={`mailto:${email}`} className="font-medium text-[var(--ink)] underline decoration-[var(--brand)] underline-offset-4">
          {email}
        </a>
      </div>
    </footer>
  );
}
