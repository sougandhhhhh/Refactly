import { Menu, X } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SmoothCursor } from "@/components/common/SmoothCursor";

type AppLayoutProps = {
  children: ReactNode;
};

const SIDEBAR_EXPANDED = 240;
const SIDEBAR_COLLAPSED = 64;

export function AppLayout({ children }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = () => setCollapsed((v) => !v);
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;

  return (
    <div className="flex min-h-screen bg-page-texture">
      <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full">
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <SmoothCursor />
      <div
        style={{ paddingLeft: sidebarWidth }}
        className="min-w-0 flex-1 transition-[padding-left] duration-300 ease-linear"
      >
        <div className="flex items-center gap-3 border-b border-stone-200 px-4 py-3 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-sm text-charcoal-light hover:bg-stone-100"
            aria-label="Open menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
