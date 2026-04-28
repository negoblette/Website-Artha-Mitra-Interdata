'use client';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

function normalizePhone(value = '') {
  return value.replace(/[^\d+]/g, '');
}

function stripLeadingPlus(value = '') {
  return value.replace(/^\+/, '');
}

function formatWhatsAppHref(value = '') {
  return stripLeadingPlus(normalizePhone(value));
}

const footerLinks = {
  Product: [
    { label: 'Products', href: '/products' },
    { label: 'Solution', href: '/solution' },
    { label: 'Insight', href: '/insight' },
  ],
  Company: [
    { label: 'About us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

export default function ContactForm({ contact, whatsapp }) {
  const officePhone = contact?.phone?.split('/')?.[0] ?? contact?.phone ?? '';
  const officePhoneHref = normalizePhone(officePhone);
  const whatsappHref = formatWhatsAppHref(whatsapp || contact?.whatsapp || officePhone);
  const mapHref = contact?.mapLink || contact?.mapEmbedUrl || '#';

  return (
    <section className="bg-[#dfe6f2] pb-0">
      <div className="w-full bg-[#f4f5f9] px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-14 lg:px-10 lg:pb-18 lg:pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <AnimatedSection>
            <div className="max-w-3xl">
              <p className="text-sm leading-7 text-[#0f172a]/72">
                You can contact us through several ways.
                <br />
                Choose the one most convenient for you.
              </p>

              <div className="mt-8 space-y-3 sm:space-y-4">
                <a
                  href={`mailto:${contact?.email}`}
                  className="block text-[clamp(2.15rem,4.6vw,4.65rem)] font-semibold leading-[0.92] tracking-tight text-[#17213d] transition-colors hover:text-[#0a0b85]"
                >
                  {contact?.email}
                </a>
                <a
                  href={`tel:${officePhoneHref}`}
                  className="block text-[clamp(2.05rem,4.2vw,4.2rem)] font-semibold leading-[0.95] tracking-tight text-[#17213d] transition-colors hover:text-[#0a0b85]"
                >
                  {contact?.phone}
                </a>
                <a
                  href={`https://wa.me/${whatsappHref}?text=${encodeURIComponent(
                    'Hello Artha Mitra Interdata, I would like to discuss a project.',
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[clamp(2rem,4vw,4rem)] font-semibold leading-[0.95] tracking-tight text-[#17213d] transition-colors hover:text-[#0a0b85]"
                >
                  {whatsapp || contact?.phone}
                </a>
              </div>

              <div className="mt-14 max-w-2xl">
                <p className="text-sm leading-7 text-[#0f172a]/78 sm:text-base">
                  Click the button below to request a call, send a WhatsApp message, or email our
                  team directly. We&apos;ll reach out as soon as possible.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href={`tel:${officePhoneHref}`}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1f2f57] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(31,47,87,0.24)] transition-transform hover:-translate-y-0.5"
                  >
                    Request a call
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href={`https://wa.me/${whatsappHref}?text=${encodeURIComponent(
                      'Hello Artha Mitra Interdata, I would like to discuss a project.',
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[#0f172a]/10 bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition-transform hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp us
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="space-y-12">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a8f9d]">
                  Head Office:
                </p>
                <div className="space-y-1 text-[15px] leading-7 text-[#111827]">
                  <p>{contact.address}</p>
                  <p>{contact.phone}</p>
                  <p>{contact.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#8a8f9d]">
                  Location:
                </p>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-[15px] font-medium text-[#111827] transition-colors hover:text-[#0a0b85]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0a0b85] shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                    <MapPin className="h-4 w-4" />
                  </span>
                  Open map
                </a>
              </div>

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-2">
                {Object.entries(footerLinks).map(([heading, links]) => (
                  <div key={heading} className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a8f9d]">
                      {heading}
                    </p>
                    <div className="space-y-2">
                      {links.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="block text-sm text-[#111827] transition-colors hover:text-[#0a0b85]"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                  href={`tel:${officePhoneHref}`}
                  className="flex items-center justify-between rounded-full bg-white px-4 py-3 text-sm font-medium text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-colors hover:text-[#0a0b85]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f2f57] text-white">
                      <Phone className="h-4 w-4" />
                    </span>
                    Call office
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={`mailto:${contact?.email}`}
                  className="flex items-center justify-between rounded-full bg-white px-4 py-3 text-sm font-medium text-[#111827] shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition-colors hover:text-[#0a0b85]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1f2f57] text-white">
                      <Mail className="h-4 w-4" />
                    </span>
                    Email us
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
