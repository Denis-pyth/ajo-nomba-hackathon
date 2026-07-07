import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { DashboardMockup } from "./components/DashboardMockup";
import { ProblemSection } from "./components/ProblemSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { HowItWorks } from "./components/HowItWorks";
import { WaysToSave } from "./components/WaysToSave";
import { Testimonials } from "./components/Testimonials";
import { FAQs } from "./components/FAQs";
import { GetStarted } from "./components/GetStarted";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col items-center bg-white min-h-full">
      <Nav />
      <main className="flex flex-col items-center w-full">
        <Hero />
        <DashboardMockup />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorks />
        <WaysToSave />
        <Testimonials />
        <FAQs />
        <GetStarted />
      </main>
      <Footer />
    </div>
  );
}
