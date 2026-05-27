import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { showOldMoneyToast } from "@/components/common/Toast";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function VerifyEmail() {
  const navigate = useNavigate();

  return (
    <PageWrapper className="cross-rule flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
      <Card className="relative w-full max-w-lg p-6 sm:p-10">
        <BrandLogo size="md" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute right-6 top-6 font-mono text-2xs uppercase tracking-[0.16em] text-gold hover:text-gold-dark sm:right-10 sm:top-10"
        >
          ← Back
        </button>
        <p className="eyebrow mt-5">Verify Email</p>
        <h1 className="mt-3 text-4xl text-charcoal-dark sm:text-5xl">Confirm your email.</h1>
        <p className="mt-5 text-xl text-charcoal-light">
          We sent a secure verification link to your inbox. Complete verification to finalize account setup.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            className="w-full"
            onClick={() => showOldMoneyToast("Verification email sent again.")}
          >
            Resend Email
          </Button>
          <Link to="/dashboard" className="w-full">
            <Button variant="ghost" className="w-full">
              Continue to Dashboard
            </Button>
          </Link>
        </div>
      </Card>
    </PageWrapper>
  );
}
