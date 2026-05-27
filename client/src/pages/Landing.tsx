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
      <Navbar />
      <Hero />
      <Features />
      <EditorialEngine />
      <Pricing />
      <Footer />
    </PageWrapper>
  );
}
