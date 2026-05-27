import { Bell, Search, SlidersHorizontal } from "lucide-react";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="eyebrow">Private Overview</p>
        <h1 className="mt-3 text-5xl text-charcoal-dark">Engineering command, discreetly presented.</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          className="flex h-11 items-center gap-3 rounded-sm border border-stone-200 bg-cream-50 px-4 text-charcoal-light shadow-old-money"
          onClick={() => showOldMoneyToast("Search is ready for repository and session lookup.")}
        >
          <Search size={14} />
          <span className="font-mono text-xs uppercase tracking-[0.18em]">Search</span>
        </button>
        <button
          className="flex h-11 w-11 items-center justify-center rounded-sm border border-stone-200 bg-cream-50 shadow-old-money"
          onClick={() => showOldMoneyToast("You have 3 unread review notifications.")}
        >
          <Bell size={14} className="text-charcoal-light" />
        </button>
        <Button
          variant="outline"
          className="h-11 gap-2 px-4 py-0"
          onClick={() => showOldMoneyToast("Filters applied to active review sessions.")}
        >
          <SlidersHorizontal size={14} />
          Filters
        </Button>
      </div>
    </div>
  );
}
