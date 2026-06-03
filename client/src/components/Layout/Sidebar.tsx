import { BarChart3, ClipboardCheck, LayoutGrid, PanelLeft, PanelLeftClose, Settings, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { SignOutDialog } from "@/components/common/SignOutDialog";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const LS_LAST_SESSION = "refactly_last_session";

const items = [
  { label: "Reviews", icon: Sparkles, href: "/editor/session-2048", dynamic: true },
  { label: "Overview", icon: LayoutGrid, href: "/overview" },
  { label: "Sessions", icon: ClipboardCheck, href: "/sessions" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
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

  const isActive = (href: string) => window.location.pathname === href;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-10 flex h-svh flex-col justify-between bg-gold px-3 py-5 text-charcoal-dark transition-[width] duration-300 ease-linear sidebar-scroll",
        collapsed ? "w-[64px]" : "w-[240px]",
      )}
    >
      <div>
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link to="/dashboard" aria-label="Refactly dashboard">
              <BrandLogo size="sm" showDescriptor={false} />
            </Link>
          )}
          <button
            onClick={onToggle}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-charcoal-dark/60 hover:bg-charcoal-dark/10 hover:text-charcoal-dark"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
        <div className={cn("mt-4 h-px w-full bg-charcoal-dark/15", collapsed && "w-8 mx-auto")} />
        <nav className={cn("mt-4 space-y-1", collapsed && "flex flex-col items-center")}>
          {items.map(({ label, icon: Icon, href, dynamic }) => {
            const active = isActive(href);
            if (dynamic) {
              const lastSession = localStorage.getItem(LS_LAST_SESSION);
              return (
                <button
                  key={label}
                  onClick={() => navigate(lastSession ? `/editor/${lastSession}` : href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-sm px-3 py-3 font-body text-lg text-charcoal-dark/70 transition-all duration-200 hover:bg-charcoal-dark/10 hover:text-charcoal-dark",
                    collapsed && "justify-center px-0",
                    active && "bg-charcoal-dark/15 text-charcoal-dark font-medium",
                  )}
                  title={collapsed ? label : undefined}
                >
                  <Icon size={18} strokeWidth={1.6} />
                  {!collapsed && <span>{label}</span>}
                </button>
              );
            }
            return (
              <Link
                key={label}
                to={href}
                className={cn(
                  "flex items-center gap-3 rounded-sm px-3 py-3 font-body text-lg text-charcoal-dark/70 transition-all duration-200 hover:bg-charcoal-dark/10 hover:text-charcoal-dark",
                  collapsed && "justify-center px-0",
                  active && "bg-charcoal-dark/15 text-charcoal-dark font-medium",
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
        <div className={cn("h-px w-full bg-charcoal-dark/15", collapsed && "w-8")} />
        <div className={cn("flex items-center gap-3", collapsed && "flex-col")}>
          {user?.image ? (
            <img
              src={user.image}
              alt={userName}
              className="h-9 w-9 shrink-0 rounded-sm border border-charcoal-dark/30 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-charcoal-dark/20 font-mono text-xs uppercase text-charcoal-dark">
              {initials || "?"}
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-body text-base text-charcoal-dark">{userName}</p>
              {userEmail && (
                <p className="break-all font-mono text-[9px] uppercase tracking-[0.15em] leading-relaxed text-charcoal-dark/55">{userEmail}</p>
              )}
            </div>
          )}
        </div>
        <SignOutDialog collapsed={collapsed} variant="sidebar" />
      </div>
    </aside>
  );
}
