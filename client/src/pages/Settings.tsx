import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { showOldMoneyToast } from "@/components/common/Toast";
import { useAuth } from "@/lib/auth";

export function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || "Private Workspace";
  const userEmail = user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <AppLayout>
      <PageWrapper className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="eyebrow mb-8">Settings</h1>

        <section className="card-old-money p-6">
          <h2 className="font-display text-2xl text-charcoal-dark">Account</h2>
          <div className="mt-6 flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt={userName}
                className="h-14 w-14 rounded-sm border border-stone-300 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-charcoal-dark/15 font-mono text-sm uppercase text-charcoal-dark">
                {initials || "?"}
              </div>
            )}
            <div>
              <p className="font-display text-xl text-charcoal-dark">{userName}</p>
              {userEmail && (
                <p className="mt-0.5 font-mono text-xs text-charcoal-light/70">{userEmail}</p>
              )}
            </div>
          </div>
        </section>

        <section className="card-old-money mt-6 p-6">
          <h2 className="font-display text-2xl text-charcoal-dark">Preferences</h2>
          <p className="mt-3 text-charcoal-light">Preferences and configuration options will appear here.</p>
          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between">
              <span className="font-body text-charcoal-dark">Email Notifications</span>
              <input type="checkbox" className="h-4 w-4 accent-gold" defaultChecked />
            </label>
            <label className="flex items-center justify-between">
              <span className="font-body text-charcoal-dark">Auto-save Reviews</span>
              <input type="checkbox" className="h-4 w-4 accent-gold" defaultChecked />
            </label>
          </div>
        </section>

        <section className="card-old-money mt-6 border-cognac-muted/40 p-6">
          <h2 className="font-display text-2xl text-charcoal-dark">Sign Out</h2>
          <p className="mt-3 text-charcoal-light">Sign out of your Refactly account on this device.</p>
          <Button
            variant="ghost"
            className="mt-5 border border-cognac-muted/50 text-cognac-dark hover:bg-cognac/10"
            onClick={() => {
              signOut();
              showOldMoneyToast("You have been signed out of Refactly.");
              navigate("/signin", { replace: true });
            }}
          >
            <LogOut size={14} className="mr-2" />
            Sign Out
          </Button>
        </section>
      </PageWrapper>
    </AppLayout>
  );
}
