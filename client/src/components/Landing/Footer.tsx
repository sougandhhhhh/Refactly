import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";

export function Footer() {
  return (
    <footer className="bg-charcoal-dark px-6 py-16 text-cream-50 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 border-b border-gold-muted/20 pb-8 md:flex-row md:items-end">
          <div>
            <Link to="/" onClick={() => window.scrollTo(0, 0)} aria-label="Refactly home">
              <BrandLogo size="md" showDescriptor={false} wordClassName="text-cream-50" />
            </Link>
            <div className="divider-gold" />
            <p className="max-w-sm text-lg text-cream-50/70">
              AI-powered code review for teams who prefer craftsmanship over noise.
            </p>
          </div>
          <div className="flex gap-6 font-body text-lg text-cream-50/80">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
        <p className="pt-6 font-mono text-2xs uppercase tracking-[0.18em] text-cream-50/55">
          Copyright 2026 Refactly. Spectral rights reserved.
        </p>
      </div>
    </footer>
  );
}
