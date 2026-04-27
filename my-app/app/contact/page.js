import { getContent } from '@/lib/content';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';

export const metadata = {
  title: 'Contact Us — Artha Mitra Interdata',
  description: 'Get in touch with us. We are ready to help optimize your IT infrastructure.',
};

export default function ContactPage() {
  const global = getContent('global');

  return (
    <>
      <ContactHero />
      <ContactInfo contact={global.contact} whatsapp={global.whatsapp} />
    </>
  );
}
