import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";

export function Navbar() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-stone-200 bg-cream-50/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} aria-label="Refactly home">
          <BrandLogo size="sm" showDescriptor={false} />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="font-body text-lg uppercase tracking-[0.08em] text-charcoal-light hover:text-gold">Platform</a>
          <a href="#editorial-engine" className="font-body text-lg uppercase tracking-[0.08em] text-charcoal-light hover:text-gold">Editorial Engine</a>
          <a href="#pricing" className="font-body text-lg uppercase tracking-[0.08em] text-charcoal-light hover:text-gold">Pricing</a>
          <Link to="/signin?redirect=%2Fdashboard" className="btn-gold">
            Sign In / Up
          </Link>
        </nav>
        <Link to="/signin?redirect=%2Fdashboard" className="btn-gold md:hidden">
          Sign In / Up
        </Link>
      </div>
    </header>
  );
}
