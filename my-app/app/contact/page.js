import { getContent } from '@/lib/content';
import ContactHero from '@/components/contact/ContactHero';
import ContactInfo from '@/components/contact/ContactInfo';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Contact Us — Artha Mitra Interdata',
  description: 'Get in touch with us. We are ready to help optimize your IT infrastructure.',
};

export default function ContactPage() {
  // Ambil data global untuk kebutuhan kontak, WhatsApp, dan alamat kantor.
  const global = getContent('global');

  return (
    <>
      {/* Section hero utama halaman Contact Us. */}
      <ContactHero />

      {/* Section detail kontak dan lokasi kantor. */}
      <ContactInfo contact={global.contact} whatsapp={global.whatsapp} />
    </>
  );
}
