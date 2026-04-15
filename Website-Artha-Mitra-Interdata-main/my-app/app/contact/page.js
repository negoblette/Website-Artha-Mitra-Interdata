import { getContent } from '@/lib/content';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
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
      <ContactForm contact={global.contact} />
      <ContactInfo contact={global.contact} mapUrl={global.contact.mapEmbedUrl} />
    </>
  );
}
