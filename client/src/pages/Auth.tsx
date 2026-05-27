import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { GoldDivider } from "@/components/common/GoldDivider";
import { showOldMoneyToast } from "@/components/common/Toast";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";

export function Auth() {
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("Refactly Capital");
  const location = useLocation();
  const navigate = useNavigate();
  const { signInWithCredentials } = useAuth();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  return (
    <PageWrapper className="cross-rule flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-xl p-10">
        <BrandLogo size="md" />
        <p className="eyebrow">Private Entry</p>
        <h1 className="mt-4 text-5xl text-charcoal-dark">Enter the review room.</h1>
        <p className="mt-5 text-2xl leading-relaxed text-charcoal-light">
          Refactly is designed for engineering teams who prefer composure, clarity, and exacting standards.
        </p>
        <GoldDivider label="Access" />
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Eleanor Voss"
              className="w-full rounded-sm border border-stone-200 bg-cream-50 px-4 py-3 font-body text-2xl text-charcoal-dark outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Workspace</span>
            <input
              value={workspace}
              onChange={(event) => setWorkspace(event.target.value)}
              className="w-full rounded-sm border border-stone-200 bg-cream-50 px-4 py-3 font-body text-2xl text-charcoal-dark outline-none focus:border-gold"
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              const finalName = name.trim() || workspace.trim() || "Private Workspace";
              signInWithCredentials({ name: finalName });
              showOldMoneyToast(`Welcome back, ${finalName}.`);
              navigate(redirect, { replace: true });
            }}
          >
            Continue with Workspace
          </Button>
          <Link to="/" className="flex-1">
            <Button variant="ghost" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </PageWrapper>
  );
}
