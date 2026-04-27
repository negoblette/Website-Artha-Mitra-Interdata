'use client';
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
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

export default function ContactInfo({ contact, whatsapp }) {
  const officePhone = contact?.phone?.split('/')?.[0] ?? contact?.phone ?? '';
  const officePhoneHref = normalizePhone(officePhone);
  const whatsappHref = formatWhatsAppHref(whatsapp || contact?.whatsapp || officePhone);
  const mapHref = contact?.mapLink || contact?.mapEmbedUrl || '#';
  const officeAddress =
    contact?.address ||
    'Wisma Interdata, JL. Dr. Makaliwe I, No.24D, RT.6/RW.6, Grogol, Kec. Grogol Petamburan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11450';

  return (
    <section className="relative overflow-hidden bg-[#eef3ff] pb-0">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.95),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(47,84,235,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.68)_0%,rgba(238,243,255,0.92)_100%)]" />

      <div
        className="pointer-events-none absolute inset-x-0 inset-y-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute inset-x-[-12%] inset-y-0 bg-[url('/decor/grid.svg')] bg-[length:1220px_auto] bg-repeat-x bg-top opacity-32 [filter:invert(7%)_sepia(100%)_saturate(3600%)_hue-rotate(200deg)_brightness(0.5)_contrast(1.28)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(238,243,255,1)_0%,rgba(238,243,255,0.76)_14%,rgba(238,243,255,0)_28%,rgba(238,243,255,0)_74%,rgba(238,243,255,0.86)_92%,rgba(238,243,255,1)_100%)]" />
        <div className="absolute -left-10 top-10 h-72 w-72 rounded-full bg-[#2f54eb]/10 blur-[120px]" />
        <div className="absolute -right-10 top-20 h-72 w-72 rounded-full bg-white/70 blur-[120px]" />
        <div className="absolute bottom-0 left-[3rem] h-56 w-56 rounded-full bg-[#2f54eb]/8 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[98rem] px-2 py-16 sm:px-8 lg:px-3 lg:py-20 xl:px-5">
        <div className="grid gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-20">
          <AnimatedSection>
            <div className="relative max-w-2xl   lg:pt-4">
              

              <h2 className="mt-5 max-w-lg lg:text-[4.5rem] uppercase font-black leading-[0.94] tracking-tight text-[#16305f]">
                Let&apos;s create
                <br />
                something
                <br />
                great{' '}
                <span className="relative inline-block text-[#2f54eb]">
                  together.
                  <span className="absolute inset-x-0 -bottom-2 h-2 rounded-full bg-[#2f54eb]/20" />
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-[16px] font-semibold leading-8 text-[#34415f] sm:text-[19px]">
                We&apos;re here to help with questions, projects, and collaboration ideas.
                Reach out through the channel that feels most comfortable for you.
              </p>

              <div className="mt-10 border-l border-dashed border-[#2f54eb]/25 pl-5">
                <div className="space-y-5">
                  <a
                    href={`mailto:${contact?.email}`}
                    className="group flex items-start gap-4 text-[#16305f] transition-colors hover:text-[#2f54eb]"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#2f54eb] shadow-[0_14px_30px_rgba(47,84,235,0.10)] ring-1 ring-[#2f54eb]/8 transition-transform group-hover:scale-105">
                      <Mail className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2f54eb]">
                        Email
                      </span>
                      <span className="mt-1 block break-all text-[1.4rem] font-bold leading-[1.15] sm:text-[1.7rem]">
                        {contact?.email}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`tel:${officePhoneHref}`}
                    className="group flex items-start gap-4 text-[#16305f] transition-colors hover:text-[#2f54eb]"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#2f54eb] shadow-[0_14px_30px_rgba(47,84,235,0.10)] ring-1 ring-[#2f54eb]/8 transition-transform group-hover:scale-105">
                      <Phone className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2f54eb]">
                        Phone
                      </span>
                      <span className="mt-1 block text-[1.4rem] font-bold leading-[1.15] sm:text-[1.7rem]">
                        {contact?.phone}
                      </span>
                    </span>
                  </a>

                  <a
                    href={`https://wa.me/${whatsappHref}?text=${encodeURIComponent(
                      'Hello Artha Mitra Interdata, I would like to discuss a project.',
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-4 text-[#16305f] transition-colors hover:text-[#2f54eb]"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white text-[#21c45d] shadow-[0_14px_30px_rgba(47,84,235,0.10)] ring-1 ring-[#2f54eb]/8 transition-transform group-hover:scale-105">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-[#2f54eb]">
                        WhatsApp
                      </span>
                      <span className="mt-1 block text-[1.4rem] font-bold leading-[1.15] sm:text-[1.7rem]">
                        {whatsapp || contact?.phone}
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={`tel:${officePhoneHref}`}
                  className="inline-flex items-center gap-3 rounded-full bg-[#2f54eb] px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(47,84,235,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  <Phone className="h-4 w-4" />
                  Request a call
                  <ArrowRight className="h-4 w-4" />
                </a>

                <a
                  href={`https://wa.me/${whatsappHref}?text=${encodeURIComponent(
                    'Hello Artha Mitra Interdata, I would like to discuss a project.',
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-[#2f54eb] px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(47,84,235,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="h-4 w-4 text-white" />
                  WhatsApp us
                </a>
              </div>

              
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <div className="relative lg:pl-8 xl:pl-12">
              <div className="pointer-events-none absolute -right-10 top-6 h-48 w-48 rounded-full bg-[#2f54eb]/10 blur-[100px]" />
              <div className="pointer-events-none absolute right-0 top-20 h-64 w-64 rounded-full bg-white/60 blur-[120px]" />

              <h3 className="mt-5 max-w-lg lg:text-[4.5rem] uppercase font-black leading-[0.94] tracking-tight text-[#16305f]">
                HEAD OFFICE
              </h3>
              <div className="mt-3 h-1.5 w-24 rounded-full bg-[#2f54eb]" />

              <p className="mt-5 max-w-xl text-[16px] font-semibold leading-8 text-[#34415f] sm:text-[19px]">
                {officeAddress}
              </p>

              <div className="mt-8 overflow-hidden rounded-[2.4rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(248,250,255,0.92))] shadow-[0_26px_60px_rgba(47,84,235,0.10)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(47,84,235,0.08),transparent_28%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.85),transparent_30%)]" />
                <div className="relative left-5 top-5 z-10">
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-3 text-sm font-semibold text-[#2f54eb] shadow-[0_12px_28px_rgba(47,84,235,0.12)] backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                  >
                    Open in Maps
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>

                {contact.mapEmbedUrl ? (
                  <iframe
                    src={contact.mapEmbedUrl}
                    width="100%"
                    height="430"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location"
                    className="block w-full"
                  />
                ) : (
                  <div className="flex min-h-[430px] items-center justify-center px-6 py-10 text-center">
                    <div>
                      <p className="text-lg font-semibold text-[#16305f]">Artha Mitra Interdata</p>
                      <p className="mt-2 max-w-md text-sm leading-7 text-[#526076]">
                        {officeAddress}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
