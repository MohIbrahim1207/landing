import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import IndustriesSection from '../components/IndustriesSection';
import ProductShowcase from '../components/ProductShowcase';
import FeaturedSolutions from '../components/FeaturedSolutions';
import WhyChooseUs from '../components/WhyChooseUs';
import ProcessWorkflow from '../components/ProcessWorkflow';
import ProcessConfigurator from '../components/ProcessConfigurator';
import RFQSection from '../components/RFQSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0d1516] text-[#dce4e6] overflow-x-hidden antialiased">
      {/* Translucent floating navbar */}
      <Navbar />

      {/* Main landing sections */}
      <main>
        {/* Full-screen high-torque Hero */}
        <Hero />

        {/* Core details of Flow Force */}
        <AboutSection />

        {/* Sector markets supported */}
        <IndustriesSection />

        {/* 8 Product categories */}
        <ProductShowcase />

        {/* Specific machinery solutions case studies */}
        <FeaturedSolutions />

        {/* Key values and code conformity */}
        <WhyChooseUs />

        {/* Road-mapped timeline */}
        <ProcessWorkflow />

        {/* Interactive process calculator and equipment sizing */}
        <ProcessConfigurator />

        {/* B2B Contact / RFQ submission */}
        <RFQSection />
      </main>

      {/* High-end industrial footer */}
      <Footer />
    </div>
  );
}
