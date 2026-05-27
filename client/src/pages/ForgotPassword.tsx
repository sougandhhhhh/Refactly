import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ForgotPassword() {
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
        <p className="eyebrow mt-5">Password Recovery</p>
        <h1 className="mt-3 text-4xl text-charcoal-dark sm:text-5xl">Forgot password?</h1>
        <p className="mt-5 text-xl text-charcoal-light">
          Recovery flow endpoint is ready at `/api/auth/forgot-password`. Connect your mail service and token reset route.
        </p>
        <Link to="/signin" className="mt-8 block">
          <Button className="w-full">Back to Sign In</Button>
        </Link>
      </Card>
    </PageWrapper>
  );
}
