import { Search, X } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="eyebrow">Private Overview</p>
        <h1 className="mt-3 text-5xl text-charcoal-dark">Engineering command, discreetly presented.</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center gap-2 rounded-sm border border-gold bg-cream-50 px-3 shadow-old-money">
              <Search size={14} className="text-charcoal-light" />
              <Input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sessions..."
                className="w-56 border-none bg-transparent px-0 py-2 text-sm placeholder:text-stone-400 focus:outline-none"
                onKeyDown={(e) => { if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); } }}
              />
              <button onClick={() => { setSearchOpen(false); setSearchQuery(""); }} className="text-stone-400 hover:text-charcoal-dark">
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              className="flex h-11 items-center gap-3 rounded-sm border border-stone-200 bg-cream-50 px-4 text-charcoal-light shadow-old-money"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={14} />
              <span className="font-mono text-xs uppercase tracking-[0.18em]">Search</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
