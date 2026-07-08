import { getContent } from '@/lib/content';
import { resolveReferences } from '@/lib/referenceResolver';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import OfferingsSection from '@/components/home/OfferingsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsSection from '@/components/home/NewsSection';
import ContactSection from '@/components/home/ContactSection';
import WhatsAppButton from '@/components/WhatsAppButton';

export default async function Home() {
  const homepageData = getContent('homepage');
  const global = getContent('global');

  // resolved reference
  const resolvedHomepage = await resolveReferences(homepageData);

  return (
    <div>
      <HeroSection data={resolvedHomepage.hero} />
      <HowItWorksSection data={resolvedHomepage.howItWorks} />
      <OfferingsSection data={resolvedHomepage.offerings} />
      <TestimonialsSection data={resolvedHomepage.testimonials} />
      <NewsSection data={resolvedHomepage.news} />
      <ContactSection data={resolvedHomepage.contactSection} contact={global.contact} socials={global.footer?.socials} whatsapp={global.whatsapp} />
      {global.whatsapp && <WhatsAppButton phoneNumber={global.whatsapp} />}
    </div>
  );
}
