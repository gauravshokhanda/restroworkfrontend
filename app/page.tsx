import HeroSection from './components/HeroSection';
import FeatureList from './components/FeatureList';
import TestimonialBlock from './components/TestimonialBlock';
import CTASection from './components/CTASection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeatureList />
      <TestimonialBlock />
      <CTASection />
    </div>
  );
}
