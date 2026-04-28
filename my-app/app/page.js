import { getContent } from '@/lib/content';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import OfferingsSection from '@/components/home/OfferingsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsSection from '@/components/home/NewsSection';
import ContactSection from '@/components/home/ContactSection';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function Home() {
  const data = getContent('homepage');
  const global = getContent('global');

  return (
    <div>
      <HeroSection data={data.hero} />
      <HowItWorksSection data={data.howItWorks} />
      <OfferingsSection data={data.offerings} />
      <TestimonialsSection data={data.testimonials} />
      <NewsSection data={data.news} />
      <ContactSection data={data.contactSection} contact={global.contact} socials={global.footer?.socials} />
      {global.whatsapp && <WhatsAppButton phoneNumber={global.whatsapp} />}
    </div>
  );
}
