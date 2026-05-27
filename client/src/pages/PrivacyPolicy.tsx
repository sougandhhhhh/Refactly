import { Link, useNavigate } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Footer } from "@/components/Landing/Footer";
import { PageWrapper } from "@/components/Layout/PageWrapper";
import { Button } from "@/components/ui/button";

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="cross-rule min-h-screen">
        <div className="mx-auto max-w-4xl px-6 pt-24 md:px-10">
          <div className="flex items-center justify-between">
            <Link to="/" aria-label="Refactly home" className="inline-block">
              <BrandLogo size="md" showDescriptor={false} />
            </Link>
            <Button variant="outline" onClick={() => navigate(-1)}>
              &larr; Back
            </Button>
          </div>
          <h1 className="mt-12 text-5xl text-charcoal-dark md:text-6xl">Privacy Policy</h1>
          <p className="mt-3 font-mono text-2xs uppercase tracking-[0.24em] text-gold">Last updated: 26 May 2026</p>

          <section className="mt-16 space-y-10 text-lg leading-relaxed text-charcoal-light">
            <div>
              <h2 className="text-2xl text-charcoal-dark">1. What We Collect</h2>
              <p className="mt-3">
                Refactly collects only the data necessary to provide code review services: your email address, display name, and avatar (if you sign in via Google), plus the source code you submit for review. We do not collect browsing data, telemetry, or any information beyond what is required to operate the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">2. How We Use Your Data</h2>
              <p className="mt-3">
                Your data is used exclusively to power your review sessions — analysing submitted code, generating editorial feedback, and maintaining your account. We never train models on your code, sell your data, or share it with third parties for advertising or analytics.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">3. Code Storage & Retention</h2>
              <p className="mt-3">
                Code submitted for review is stored temporarily to support session history and revision tracking. You may delete any session at any time, which permanently removes the associated code from our servers. Automated purges occur for sessions inactive beyond twelve months.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">4. Third-Party Services</h2>
              <p className="mt-3">
                Refactly uses Supabase for authentication and database hosting, and Groq for AI-powered analysis. Each service processes data under strict contractual agreements that prohibit unauthorised use. No third party has access to your code beyond what is strictly necessary for the feature you are using.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">5. Your Rights</h2>
              <p className="mt-3">
                You may request a copy of your data, correct inaccuracies, or delete your account at any time by contacting us. We honour all rights under applicable data protection laws and will respond without undue delay.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">6. Changes to This Policy</h2>
              <p className="mt-3">
                If we change how we handle your data, we will notify you via email and update the date at the top of this page. Continued use of Refactly after changes constitutes acceptance of the updated policy.
              </p>
            </div>
          </section>

          <div className="mt-16 border-t border-stone-200 py-8 text-center">
            <p className="text-base text-charcoal-light">
              Questions? <span className="text-gold">legal@refactly.dev</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}
