import { useState, useEffect } from "react";
import { AppLayout } from "@/components/Layout/AppLayout";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { SignOutDialog } from "@/components/common/SignOutDialog";
import { showOldMoneyToast } from "@/components/common/Toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { languages } from "@/components/Editor/MonacoEditorPanel";

export function Settings() {
  const { user, isGoogleUser, updateUser } = useAuth();

  const userName = user?.name || "Private Workspace";
  const userEmail = user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const [displayName, setDisplayName] = useState(userName);
  const [defaultLang, setDefaultLang] = useState(user?.defaultLanguage || "python");
  const [isSaving, setIsSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (user?.name) setDisplayName(user.name);
    if (user?.defaultLanguage) setDefaultLang(user.defaultLanguage);
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateUser({ name: displayName, defaultLanguage: defaultLang });
      showOldMoneyToast("Profile updated successfully.");
    } catch {
      showOldMoneyToast("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showOldMoneyToast("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showOldMoneyToast("Passwords do not match.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      if (!isGoogleUser) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: currentPassword,
        });
        if (signInError) {
          showOldMoneyToast("Current password is incorrect.");
          setIsUpdatingPassword(false);
          return;
        }
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showOldMoneyToast("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      showOldMoneyToast("Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <AppLayout>
      <PageWrapper className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl text-charcoal-dark mb-8">Settings</h1>

        <section className="card-old-money p-6">
          <h2 className="font-display text-2xl text-charcoal-dark">Account</h2>
          <div className="mt-6 flex items-center gap-4">
            {user?.image ? (
              <img
                src={user.image}
                alt={userName}
                className="h-14 w-14 shrink-0 rounded-sm border border-stone-300 object-cover"
              />
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-charcoal-dark/15 font-mono text-sm uppercase text-charcoal-dark">
                {initials || "?"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full border-0 border-b border-stone-200 bg-transparent pb-1 font-display text-xl text-charcoal-dark outline-none transition-colors focus:border-gold"
              />
              {userEmail && (
                <p className="mt-1 font-mono text-xs text-charcoal-light/70">{userEmail}</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="rounded-sm bg-gold px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cream-50 transition-colors hover:bg-gold-dark disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </section>

        <section className="card-old-money mt-6 p-6">
          <h2 className="font-display text-2xl text-charcoal-dark">Preferences</h2>
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-charcoal-dark">Default Programming Language</p>
                <p className="mt-0.5 font-mono text-xs text-charcoal-light/60">Language preselected when creating new sessions.</p>
              </div>
              <select
                value={defaultLang}
                onChange={(e) => setDefaultLang(e.target.value)}
                className="rounded-sm border border-stone-200 bg-[#FDFCF9] px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-charcoal-dark outline-none focus:border-gold"
              >
                {languages.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center justify-between">
              <span className="font-body text-charcoal-dark">Auto-save Reviews</span>
              <input type="checkbox" className="h-4 w-4 accent-gold" defaultChecked />
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="rounded-sm bg-gold px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cream-50 transition-colors hover:bg-gold-dark disabled:opacity-50"
            >
              {isSaving ? "Saving…" : "Save"}
            </button>
          </div>
        </section>

        <section className="card-old-money mt-6 p-6">
          <h2 className="font-display text-2xl text-charcoal-dark">Password</h2>
          <p className="mt-3 text-charcoal-light">
            {isGoogleUser
              ? "You signed up with Google. Set a password to also sign in manually."
              : "Update your account password."}
          </p>
          <div className="mt-5 space-y-4">
            {!isGoogleUser && (
              <div>
                <label className="block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 w-full rounded-sm border border-stone-200 bg-[#FDFCF9] px-3 py-2 font-elegant text-lg text-charcoal-dark outline-none transition-colors focus:border-gold"
                  placeholder="Enter current password"
                />
              </div>
            )}
            <div>
              <label className="block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">
                {isGoogleUser ? "New Password" : "New Password"}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-sm border border-stone-200 bg-[#FDFCF9] px-3 py-2 font-elegant text-lg text-charcoal-dark outline-none transition-colors focus:border-gold"
                placeholder="Min. 6 characters"
              />
            </div>
            <div>
              <label className="block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-sm border border-stone-200 bg-[#FDFCF9] px-3 py-2 font-elegant text-lg text-charcoal-dark outline-none transition-colors focus:border-gold"
                placeholder="Re-enter new password"
              />
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword}
              className="rounded-sm bg-charcoal-dark px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cream-50 transition-colors hover:bg-charcoal-dark/80 disabled:opacity-50"
            >
              {isUpdatingPassword
                ? "Updating…"
                : isGoogleUser
                  ? "Set Password"
                  : "Update Password"}
            </button>
          </div>
        </section>

        <section className="card-old-money mt-6 border-cognac-muted/40 p-6">
          <h2 className="font-display text-2xl text-charcoal-dark">Sign Out</h2>
          <p className="mt-3 text-charcoal-light">Sign out of your Refactly account on this device.</p>
          <SignOutDialog variant="settings" />
        </section>
      </PageWrapper>
    </AppLayout>
  );
}
