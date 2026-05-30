import { BarChart3, ChevronLeft, ChevronRight, ClipboardCheck, LayoutGrid, LogOut, Settings, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const items = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { label: "Sessions", icon: ClipboardCheck, href: "/dashboard" },
  { label: "Reviews", icon: Sparkles, href: "/editor/session-2048" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard" },
  { label: "Settings", icon: Settings, href: "/dashboard" },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const userName = user?.name || "Private Workspace";
  const userEmail = user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (href: string) => {
    if (href === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col justify-between bg-charcoal px-3 py-5 text-cream-50 transition-all duration-300",
        collapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      <div>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link to="/dashboard" aria-label="Refactly dashboard">
              <BrandLogo theme="dark" size="sm" showDescriptor={false} />
            </Link>
          )}
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-cream-50/60 hover:bg-cream-50/10 hover:text-cream-50"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <div className={cn("mt-4 h-px w-full bg-gold-muted/20", collapsed && "w-8 mx-auto")} />
        <nav className={cn("mt-4 space-y-1", collapsed && "flex flex-col items-center")}>
          {items.map(({ label, icon: Icon, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={label}
                to={href}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-3 font-body text-lg text-cream-50/78 transition-all duration-200 hover:bg-cream-50/10 hover:text-cream-50",
                  collapsed && "justify-center px-0",
                  active && "bg-cream-50/10 text-cream-50",
                )}
                title={collapsed ? label : undefined}
              >
                <Icon size={18} strokeWidth={1.6} />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={cn("space-y-4", collapsed && "flex flex-col items-center")}>
        <div className={cn("h-px w-full bg-gold-muted/20", collapsed && "w-8")} />
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          {user?.image ? (
            <img
              src={user.image}
              alt={userName}
              className="h-9 w-9 shrink-0 rounded-sm border border-cream-50/30 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-charcoal-muted font-mono text-xs uppercase">
              {initials || "?"}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-body text-base">{userName}</p>
              {userEmail && (
                <p className="truncate font-mono text-2xs uppercase tracking-[0.18em] text-cream-50/55">{userEmail}</p>
              )}
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full border border-gold-muted/30 text-cream-50 hover:bg-cream-50/10",
            collapsed && "px-0",
          )}
          onClick={() => {
            signOut();
            showOldMoneyToast("You have been signed out of Refactly.");
            navigate("/signin", { replace: true });
          }}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={14} className={collapsed ? "" : "mr-2"} />
          {!collapsed && "Sign Out"}
        </Button>
      </div>
    </aside>
  );
}
