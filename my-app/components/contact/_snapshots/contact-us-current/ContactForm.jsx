'use client';
import { Mail, MapPin, Clock, Sparkles } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function ContactForm({ contact }) {
  const formBg = 'bg-[linear-gradient(135deg,#0a0b85_0%,#121b9d_42%,#192bca_100%)]';

  return (
    <section className="relative z-30 overflow-visible py-20">
      <div className="absolute inset-0 z-0 bg-[#ffffff]" />
      <div className="absolute inset-0 z-0 dot-pattern opacity-35" />
      <div className="absolute inset-0 z-0 grid-pattern opacity-[0.14]" />
      <div className="absolute inset-0 z-0 mesh-gradient-accent opacity-[0.09]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full overflow-hidden">
        <div className="absolute inset-x-[-12%] inset-y-0 bg-[url('/decor/grid.svg')] bg-[length:1220px_auto] bg-repeat-x bg-top opacity-45 [filter:invert(7%)_sepia(100%)_saturate(3600%)_hue-rotate(200deg)_brightness(0.68)_contrast(1.22)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        <img
          src="/decor/contactform.svg"
          alt=""
          aria-hidden="true"
          className="absolute -left-[60rem] bottom-[-0rem] z-[1] h-[90%] w-full opacity-65"
        />
      </div>
      <div className="relative z-20 px-4 sm:px-6">
        <div className="glass-card mx-auto min-h-[70vh] w-full max-w-7xl overflow-hidden rounded-[2.25rem] border border-[#dfe7ff] bg-white shadow-[0_48px_140px_rgba(10,11,133,0.22),0_18px_40px_rgba(10,11,133,0.12)]">
          <div className="grid min-h-[70vh] grid-cols-1 lg:grid-cols-[1.02fr_1fr]">
            <AnimatedSection
              direction="left"
              className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,250,255,0.96))] px-8 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(10,11,133,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(140,163,255,0.14),transparent_30%)]" />
              <img
                src="/decor/careerelements.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-[0rem] z-0 h-full w-full object-cover opacity-90 mix-blend-multiply [filter:contrast(1.08)_saturate(1.25)_brightness(0.98)]"
              />
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.62)_38%,rgba(255,255,255,0.28)_100%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-10">
                <div className="space-y-8">
                  <div>
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-[#0a0b85]/60">
                      Contact Us
                    </p>
                    <h2 className="mb-2 text-[40px] font-bold tracking-tight text-[#0f172a]">Let&#39;s talk</h2>
                    <p className="max-w-md text-base leading-8 text-[#334155] sm:text-[1.05rem]">
                      Reach us directly through phone, WhatsApp, or email. No form needed.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div className="group flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#010268]/15 bg-[linear-gradient(135deg,#0a0b85,#0f198d)] shadow-[0_10px_24px_rgba(10,11,133,0.18)] transition-colors group-hover:bg-white">
                        <MapPin size={18} className="text-white group-hover:text-[#0f198d]" />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[1.02rem] font-medium text-[#0f172a]">Address</p>
                        <p className="text-[1.02rem] leading-7 text-[#475569]">{contact.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-[1.4rem] border border-[#dbe4ff] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,247,255,0.98))] shadow-[0_18px_40px_rgba(10,11,133,0.10)]">
                    <div className="border-b border-[#dbe4ff] px-5 py-3.5">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.26em] text-[#0a0b85]/65">
                        Location
                      </p>
                    </div>
                    {contact.mapEmbedUrl ? (
                      <iframe
                        src={contact.mapEmbedUrl}
                        width="100%"
                        height="280"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Office Location"
                        className="block w-full"
                      />
                    ) : (
                      <div className="px-5 py-5">
                        <p className="text-[1.02rem] font-semibold text-[#0f172a]">Artha Mitra Interdata</p>
                        <p className="mt-1 text-[1.02rem] leading-7 text-[#475569]">{contact.address}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection
              delay={0.2}
              className={`relative overflow-hidden px-8 pt-14 text-white sm:px-10 sm:pt-16 lg:pb-14 lg:pt-20 ${formBg}`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
              <div className="relative z-10 flex h-full min-h-[calc(78vh-7rem)] w-full flex-col justify-between gap-8">
                <div>
                  <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.34em] text-white/65">
                    Quick overview
                  </p>
                  <h2 className="text-[30px] font-bold tracking-tight text-white sm:text-[36px]">
                    Fastest contact options
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-8 text-white/78">
                    The buttons are now in the hero, so this area can stay calm and informative
                    while still supporting the office details below.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-2xl border border-white/14 bg-white/10 px-5 py-4 backdrop-blur-sm">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0a0b85]">
                      <Sparkles size={16} />
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      Best for
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">Quick decisions</p>
                  </div>

                  <div className="rounded-2xl border border-white/14 bg-white/10 px-5 py-4 backdrop-blur-sm">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0a0b85]">
                      <Clock size={16} />
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      Response
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">During office hours</p>
                  </div>

                  <div className="rounded-2xl border border-white/14 bg-white/10 px-5 py-4 backdrop-blur-sm">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#0a0b85]">
                      <Mail size={16} />
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                      Preferred
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">Email for details</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
