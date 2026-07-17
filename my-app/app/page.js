import { getContent } from '@/lib/content';
import { resolveReferences } from '@/lib/referenceResolver';
import { isSectionVisible } from '@/lib/sectionVisibility';
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
      {isSectionVisible(homepageData, 'hero') && <HeroSection data={resolvedHomepage.hero} />}
      {isSectionVisible(homepageData, 'howItWorks') && <HowItWorksSection data={resolvedHomepage.howItWorks} />}
      {isSectionVisible(homepageData, 'offerings') && <OfferingsSection data={resolvedHomepage.offerings} />}
      {isSectionVisible(homepageData, 'testimonials') && <TestimonialsSection data={resolvedHomepage.testimonials} />}
      {isSectionVisible(homepageData, 'news') && <NewsSection data={resolvedHomepage.news} />}
      {isSectionVisible(homepageData, 'contactSection') && <ContactSection data={resolvedHomepage.contactSection} contact={global.contact} socials={global.footer?.socials} whatsapp={global.whatsapp} />}
      {global.whatsapp && <WhatsAppButton phoneNumber={global.whatsapp} />}
    </div>
  );
}
