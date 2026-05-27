import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { showOldMoneyToast } from "@/components/common/Toast";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { signUpRequest, startGoogleOAuth } from "@/lib/authApi";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 1) return "weak";
  if (score === 2) return "medium";
  return "strong";
}

export function SignUp() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signInWithCredentials, signInWithGoogle } = useAuth();
  const redirect = new URLSearchParams(location.search).get("redirect") || "/verify-email";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const errors = useMemo(() => {
    return {
      firstName: !firstName.trim() ? "First name is required." : "",
      lastName: !lastName.trim() ? "Last name is required." : "",
      email:
        !email.trim()
          ? "Email is required."
          : !emailPattern.test(email)
            ? "Enter a valid email address."
            : "",
      password:
        !password.trim()
          ? "Password is required."
          : password.length < 8
            ? "Password must be at least 8 characters."
            : "",
      confirmPassword:
        !confirmPassword.trim()
          ? "Please confirm your password."
          : confirmPassword !== password
            ? "Passwords do not match."
            : "",
      terms: !agreeTerms ? "You must agree to the Terms and Privacy Policy." : "",
    };
  }, [firstName, lastName, email, password, confirmPassword, agreeTerms]);

  const strength = getPasswordStrength(password);
  const isValid = Object.values(errors).every((value) => !value);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (!isValid) {
      return;
    }

    try {
      setLoading(true);
      const result = await signUpRequest({
        firstName,
        lastName,
        email,
        password,
        acceptedTerms: agreeTerms,
      });
      const userName = result.userName || `${firstName} ${lastName}`.trim();
      signInWithCredentials({ name: userName, email });
      showOldMoneyToast("Account created successfully.");
      navigate(redirect, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageWrapper className="cross-rule flex min-h-screen items-center justify-center overflow-hidden px-4 py-2 sm:px-6">
      <Card className="relative w-full max-w-xl p-4 sm:p-6">
        <Link to="/" onClick={() => window.scrollTo(0, 0)} aria-label="Refactly home">
          <BrandLogo size="md" />
        </Link>
        <p className="eyebrow mt-3">Sign Up</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute right-6 top-6 font-mono text-2xs uppercase tracking-[0.16em] text-gold hover:text-gold-dark sm:right-10 sm:top-10"
        >
          ← Back
        </button>
        <h1 className="mt-2 text-3xl text-charcoal-dark sm:text-4xl">Create your account.</h1>
        <form className="mt-4 space-y-2.5" onSubmit={handleSubmit} noValidate>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">First Name</span>
              <input
                type="text"
                required
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="w-full rounded-sm border border-stone-200 bg-cream-50 px-3 py-2 font-body text-base text-charcoal-dark outline-none focus:border-gold"
              />
              {submitted && errors.firstName ? <p className="mt-1 text-sm text-cognac">{errors.firstName}</p> : null}
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Last Name</span>
              <input
                type="text"
                required
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="w-full rounded-sm border border-stone-200 bg-cream-50 px-3 py-2 font-body text-base text-charcoal-dark outline-none focus:border-gold"
              />
              {submitted && errors.lastName ? <p className="mt-1 text-sm text-cognac">{errors.lastName}</p> : null}
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-sm border border-stone-200 bg-cream-50 px-3 py-2 font-body text-base text-charcoal-dark outline-none focus:border-gold"
            />
            {submitted && errors.email ? <p className="mt-1 text-sm text-cognac">{errors.email}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-sm border border-stone-200 bg-cream-50 px-3 py-2 pr-10 font-body text-base text-charcoal-dark outline-none focus:border-gold"
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
            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="font-mono text-2xs uppercase tracking-[0.16em] text-stone-500">Strength</span>
              <span
                className={`rounded-sm px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] ${
                  strength === "strong"
                    ? "bg-green-100 text-green-700"
                    : strength === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {strength}
              </span>
            </div>
            {submitted && errors.password ? <p className="mt-1 text-sm text-cognac">{errors.password}</p> : null}
          </label>

          <label className="block">
            <span className="mb-2 block font-mono text-2xs uppercase tracking-[0.18em] text-stone-500">Confirm Password</span>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className="w-full rounded-sm border border-stone-200 bg-cream-50 px-3 py-2 pr-10 font-body text-base text-charcoal-dark outline-none focus:border-gold"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-light"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {submitted && errors.confirmPassword ? (
              <p className="mt-1 text-sm text-cognac">{errors.confirmPassword}</p>
            ) : null}
          </label>

          <label className="flex items-start gap-3 text-sm text-charcoal-light">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(event) => setAgreeTerms(event.target.checked)}
              className="mt-1 h-4 w-4 rounded-sm border-stone-300 text-gold focus:ring-gold"
            />
            <span>
              I agree to the{" "}
              <Link to="/terms" className="text-gold">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-gold">
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          {submitted && errors.terms ? <p className="text-sm text-cognac">{errors.terms}</p> : null}

          {serverError ? <p className="text-sm text-cognac">{serverError}</p> : null}

          <Button type="submit" disabled={!isValid || loading} className="w-full">
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Create Account"}
          </Button>
        </form>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-muted" />
          <span className="eyebrow">or</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-muted" />
        </div>
        <Button variant="ghost" className="w-full" onClick={signInWithGoogle}>
          Continue with Google
        </Button>
        <p className="mt-3 text-center text-base text-charcoal-light">
          Already have an account?{" "}
          <Link to="/signin" className="font-mono text-xs uppercase tracking-[0.16em] text-gold">
            Sign In
          </Link>
        </p>
      </Card>
    </PageWrapper>
  );
}
