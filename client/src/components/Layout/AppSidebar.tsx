import { BarChart3, ClipboardCheck, LayoutGrid, LogOut, PanelLeftClose, PanelLeft, Settings, Sparkles } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { showOldMoneyToast } from "@/components/common/Toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { label: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { label: "Sessions", icon: ClipboardCheck, href: "/dashboard#sessions" },
  { label: "Reviews", icon: Sparkles, href: "/editor/session-2048" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard#analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard#settings" },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toggleSidebar, state } = useSidebar();

  const userName = user?.name || "Private Workspace";
  const userEmail = user?.email || "";
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const isActive = (href: string) => {
    const [path, hash] = href.split("#");
    if (hash) return location.pathname === path && location.hash === `#${hash}`;
    return location.pathname === path && !location.hash;
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Link to="/dashboard" aria-label="Refactly dashboard">
            <BrandLogo size="sm" showDescriptor={false} />
          </Link>
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-charcoal-dark/60 hover:bg-charcoal-dark/10 hover:text-charcoal-dark"
            aria-label={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
          >
            {state === "expanded" ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
          </button>
        </div>
        <div className="h-px w-full bg-charcoal-dark/15" />
      </SidebarHeader>
      <SidebarRail />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(({ label, icon: Icon, href }) => (
                <SidebarMenuItem key={label}>
                  <SidebarMenuButton asChild isActive={isActive(href)}>
                    <Link to={href}>
                      <Icon size={18} strokeWidth={1.6} />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="h-px w-full bg-charcoal-dark/15" />
        <div className="flex items-center gap-3 py-2">
          <Avatar className="h-9 w-9 rounded-sm border border-charcoal-dark/30">
            <AvatarImage src={user?.image} alt={userName} />
            <AvatarFallback className="rounded-sm bg-charcoal-dark/20 font-mono text-xs uppercase text-charcoal-dark">
              {initials || "?"}
            </AvatarFallback>
          </Avatar>
          <div className={cn("min-w-0", "group-data-[collapsible=icon]/sidebar:hidden")}>
            <p className="truncate font-body text-base text-charcoal-dark">{userName}</p>
            {userEmail && (
              <p className="truncate font-mono text-2xs uppercase tracking-[0.18em] text-charcoal-dark/55">
                {userEmail}
              </p>
            )}
          </div>
        </div>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => {
                signOut();
                showOldMoneyToast("You have been signed out of Refactly.");
                navigate("/signin", { replace: true });
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
