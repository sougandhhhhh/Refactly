import { EditorialEngine } from "@/components/Landing/EditorialEngine";
import { Features } from "@/components/Landing/Features";
import { Footer } from "@/components/Landing/Footer";
import { Hero } from "@/components/Landing/Hero";
import { Navbar } from "@/components/Landing/Navbar";
import { Pricing } from "@/components/Landing/Pricing";
import { PageWrapper } from "@/components/Layout/PageWrapper";

export function Landing() {
  return (
    <PageWrapper>
      <div className="cross-rule paper-grid">
        <Navbar />
        <Hero />
        <Features />
        <EditorialEngine />
        <Pricing />
      </div>
      <Footer />
    </PageWrapper>
  );
}
