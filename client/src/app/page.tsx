// src/app/page.tsx
import Header from '@/components/landing/header';
import HeroSection from '@/components/landing/hero-section';
import FeaturesSection from '@/components/landing/features-section';
import HowItWorksSection from '@/components/landing/how-it-works-section';
import ValuePropSection from '@/components/landing/value-prop-section';
import TrustSignalsSection from '@/components/landing/trust-signals-section';
import LeadCaptureForm from '@/components/landing/lead-capture-form';
import Footer from '@/components/landing/footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ValuePropSection />
        <TrustSignalsSection />
        <LeadCaptureForm />
      </main>
      <Footer />
    </div>
  );
}