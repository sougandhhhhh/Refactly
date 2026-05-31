import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showOldMoneyToast } from "@/components/common/Toast";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type SignOutDialogProps = {
  collapsed?: boolean;
  variant?: "sidebar" | "settings";
};

export function SignOutDialog({ collapsed, variant = "sidebar" }: SignOutDialogProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    showOldMoneyToast("You have been signed out of Refactly.");
    navigate("/signin", { replace: true });
  };

  if (variant === "sidebar") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "w-full border border-charcoal-dark/30 text-charcoal-dark hover:bg-charcoal-dark/10",
              collapsed && "px-0",
            )}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut size={14} className={collapsed ? "" : "mr-2"} />
            {!collapsed && "Sign Out"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle className="font-display text-2xl text-charcoal-dark">Sign Out</DialogTitle>
          <p className="mt-4 text-charcoal-light">Are you sure you want to sign out?</p>
          <div className="mt-8 flex justify-end gap-3">
            <DialogTrigger asChild>
              <Button variant="ghost" className="border border-stone-300 text-charcoal-dark hover:bg-stone-100">
                Cancel
              </Button>
            </DialogTrigger>
            <Button
              className="bg-cognac-dark text-cream-50 hover:bg-cognac-dark/90"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="mt-5 border border-cognac-muted/50 text-cognac-dark hover:bg-cognac/10"
        >
          <LogOut size={14} className="mr-2" />
          Sign Out
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="font-display text-2xl text-charcoal-dark">Sign Out</DialogTitle>
        <p className="mt-4 text-charcoal-light">Are you sure you want to sign out of your Refactly account?</p>
        <div className="mt-8 flex justify-end gap-3">
          <DialogTrigger asChild>
            <Button variant="ghost" className="border border-stone-300 text-charcoal-dark hover:bg-stone-100">
              Cancel
            </Button>
          </DialogTrigger>
          <Button
            className="bg-cognac-dark text-cream-50 hover:bg-cognac-dark/90"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
