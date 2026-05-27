import { BarChart3, ClipboardCheck, LayoutGrid, Settings, Sparkles, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const items = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { label: "Sessions", icon: ClipboardCheck, href: "/dashboard#sessions" },
  { label: "Reviews", icon: Sparkles, href: "/editor/session-2048" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard#analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard#settings" },
];

export function Sidebar() {
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

  return (
    <aside className="flex w-full flex-col justify-between bg-forest-dark px-4 py-6 text-cream-50 sm:px-6 lg:min-h-screen lg:max-w-[240px]">
      <div>
        <Link to="/dashboard" aria-label="Refactly dashboard">
          <BrandLogo theme="dark" size="md" showDescriptor={false} />
        </Link>
        <div className="mt-6 h-px w-full bg-gold-muted/20" />
        <nav className="mt-5 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:mt-8 lg:grid-cols-1 lg:space-y-1">
          {items.map(({ label, icon: Icon, href }) => {
            const active = location.pathname === href || (href.includes("#") && location.pathname === "/dashboard");
            return (
              <Link
                key={label}
                to={href}
                className={cn(
                  "flex items-center gap-3 border-l-2 border-l-transparent px-4 py-3 font-body text-xl text-cream-50/78 transition-all duration-300 hover:border-l-gold-muted hover:text-cream-50",
                  active && "border-l-gold bg-cream-50/5 text-cream-50",
                )}
              >
                <Icon size={16} strokeWidth={1.6} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-5 border-t border-gold-muted/20 pt-5 lg:mt-0 lg:pt-6">
        <div className="flex items-center gap-3">
          {user?.image ? (
            <img
              src={user.image}
              alt={userName}
              className="h-11 w-11 rounded-sm border border-cream-50/30 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-forest-muted font-mono text-xs uppercase">
              {initials || "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-body text-xl">{userName}</p>
            {userEmail ? (
              <p className="truncate font-mono text-2xs uppercase tracking-[0.18em] text-cream-50/55">{userEmail}</p>
            ) : (
              <p className="font-mono text-2xs uppercase tracking-[0.18em] text-cream-50/55">Private Workspace</p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          className="mt-4 w-full border-gold-muted/30 text-cream-50 hover:bg-cream-50/10"
          onClick={() => {
            signOut();
            showOldMoneyToast("You have been signed out of Refactly.");
            navigate("/signin", { replace: true });
          }}
        >
          <LogOut size={14} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
