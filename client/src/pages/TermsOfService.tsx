import { Link } from "react-router-dom";
import { BrandLogo } from "@/components/common/BrandLogo";
import { Footer } from "@/components/Landing/Footer";
import { PageWrapper } from "@/components/Layout/PageWrapper";

export function TermsOfService() {
  return (
    <PageWrapper>
      <div className="cross-rule min-h-screen">
        <div className="mx-auto max-w-4xl px-6 pt-24 md:px-10">
          <Link to="/" aria-label="Refactly home" className="inline-block">
            <BrandLogo size="md" showDescriptor={false} />
          </Link>
          <h1 className="mt-12 text-5xl text-charcoal-dark md:text-6xl">Terms of Service</h1>
          <p className="mt-3 font-mono text-2xs uppercase tracking-[0.24em] text-gold">Last updated: 26 May 2026</p>

          <section className="mt-16 space-y-10 text-lg leading-relaxed text-charcoal-light">
            <div>
              <h2 className="text-2xl text-charcoal-dark">1. Acceptance</h2>
              <p className="mt-3">
                By using Refactly, you agree to these terms. If you do not agree, do not use the service. We reserve the right to update these terms; continued use after changes constitutes acceptance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">2. Service Description</h2>
              <p className="mt-3">
                Refactly provides AI-powered code review, editorial analysis, and collaboration tools for software engineers. The service is offered free of charge and may be used for both personal and commercial projects unless explicitly restricted by applicable law.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">3. User Responsibilities</h2>
              <p className="mt-3">
                You are responsible for ensuring you have the right to submit any code you upload for review. You agree not to use Refactly to store or transmit malicious code, violate others&apos; intellectual property, or circumvent any applicable laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">4. Intellectual Property</h2>
              <p className="mt-3">
                You retain full ownership of all code and content you submit to Refactly. We claim no intellectual property rights over your code. The Refactly platform, including its editorial engine, visual design, and branding, is our intellectual property.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">5. Limitation of Liability</h2>
              <p className="mt-3">
                Refactly is provided &ldquo;as is&rdquo; without warranty of any kind. We are not liable for any damages arising from your use of the service, including but not limited to data loss, review inaccuracies, or service interruptions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl text-charcoal-dark">6. Termination</h2>
              <p className="mt-3">
                You may stop using Refactly at any time. We may suspend or terminate access for violations of these terms, abuse of the service, or as required by law. Upon termination, your data will be deleted within 30 days.
              </p>
            </div>
          </section>

          <div className="mt-16 border-t border-stone-200 py-8 text-center">
            <p className="text-base text-charcoal-light">
              Contact: <span className="text-gold">legal@refactly.dev</span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </PageWrapper>
  );
}
