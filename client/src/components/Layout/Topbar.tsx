import { Bell, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [filtersActive, setFiltersActive] = useState(false);
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
                placeholder="Search sessions, repositories..."
                className="w-56 border-none bg-transparent px-0 py-2 text-sm placeholder:text-stone-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }
                }}
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
        <div className="relative">
          <button
            className="flex h-11 w-11 items-center justify-center rounded-sm border border-stone-200 bg-cream-50 shadow-old-money"
            onClick={() => setNotifOpen((v) => !v)}
          >
            <Bell size={14} className="text-charcoal-light" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-sm border border-stone-200 bg-cream-50 p-4 shadow-old-money-lg">
              <p className="font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Notifications</p>
              <div className="mt-3 space-y-2">
                <div className="rounded-sm bg-gold/5 p-3">
                  <p className="font-body text-sm text-charcoal-dark">New review request from Eleanor Voss</p>
                  <p className="mt-1 font-mono text-2xs text-stone-500">2 min ago</p>
                </div>
                <div className="rounded-sm p-3">
                  <p className="font-body text-sm text-charcoal-dark">Session #2048 analysis complete</p>
                  <p className="mt-1 font-mono text-2xs text-stone-500">1 hour ago</p>
                </div>
                <div className="rounded-sm p-3">
                  <p className="font-body text-sm text-charcoal-dark">Complexity threshold exceeded in payments module</p>
                  <p className="mt-1 font-mono text-2xs text-stone-500">3 hours ago</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <Button
          variant={filtersActive ? "gold" : "outline"}
          className="h-11 gap-2 px-4 py-0"
          onClick={() => {
            setFiltersActive((v) => !v);
            showOldMoneyToast(filtersActive ? "Filters cleared." : "Filters applied to active review sessions.");
          }}
        >
          <SlidersHorizontal size={14} />
          Filters
        </Button>
      </div>
    </div>
  );
}
