import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { GoldDivider } from "@/components/common/GoldDivider";
import { showOldMoneyToast } from "@/components/common/Toast";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { signInRequest } from "@/lib/authApi";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignIn() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    return {
      email:
        !email.trim()
          ? "Email is required."
          : !emailPattern.test(email)
            ? "Enter a valid email address."
            : "",
      password: !password.trim() ? "Password is required." : "",
    };
  }, [email, password]);

  const isValid = !errors.email && !errors.password;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);
      await signInRequest({ email, password, rememberMe });
      showOldMoneyToast("Signed in successfully.");
      navigate(redirect, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid credentials";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper className="cross-rule flex min-h-screen items-center justify-center overflow-hidden px-4 py-3 sm:px-6">
      <Card className="relative w-full max-w-lg p-5 sm:p-7">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} aria-label="Refactly home">
          <BrandLogo size="md" />
        </Link>
        <p className="eyebrow mt-3">Sign In</p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute right-5 top-5 font-mono text-2xs uppercase tracking-[0.16em] text-gold hover:text-gold-dark sm:right-7 sm:top-7"
        >
          ← Back
        </button>
        <h1 className="mt-2 text-3xl text-charcoal-dark sm:text-4xl">Welcome back.</h1>
        <form className="mt-5 space-y-3" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Email</span>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-sm border border-stone-200 bg-cream-50 px-4 py-3 font-body text-xl text-charcoal-dark outline-none focus:border-gold"
            />
            {submitted && errors.email ? <p className="mt-1 text-sm text-cognac">{errors.email}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-sm border border-stone-200 bg-cream-50 px-4 py-3 pr-12 font-body text-xl text-charcoal-dark outline-none focus:border-gold"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-light"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {submitted && errors.password ? <p className="mt-1 text-sm text-cognac">{errors.password}</p> : null}
          </label>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-base text-charcoal-light">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                className="h-4 w-4 rounded-sm border-stone-300 text-gold focus:ring-gold"
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="font-mono text-2xs uppercase tracking-[0.16em] text-gold">
              Forgot Password?
            </Link>
          </div>

          {serverError ? <p className="text-sm text-cognac">{serverError}</p> : null}

          <Button type="submit" disabled={!isValid || loading} className="w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <GoldDivider label="or" />
        <Button variant="ghost" className="w-full" onClick={signInWithGoogle}>
          Continue with Google
        </Button>
        <p className="mt-4 text-center text-base text-charcoal-light">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
            Sign Up
          </Link>
        </p>
      </Card>
    </PageWrapper>
  );
}
