'use client';
import { useState } from 'react';
import { Briefcase, Mail, Phone, MessageCircle } from 'lucide-react';

export default function CareersSection({ data }) {
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [showAllPositions, setShowAllPositions] = useState(false);

  const displayedPositions = showAllPositions
    ? data.positions
    : data.positions.slice(0, 3);

  const careerEmail = data.careerEmail || 'career@arthamitra.co.id';

  const handleApply = (positionTitle) => {
    const subject = encodeURIComponent(`Job Application - ${positionTitle} AMI`);
    const to = encodeURIComponent(careerEmail);
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}`,
      '_blank'
    );
  };

  return (
    <section id="careers" className="relative bg-transparent py-14 md:py-16">
      <img 
        src="decor/careerelements.svg" 
        alt="" 
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-full h-full object-cover opacity-100"
      />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <h2 className="text-center text-4xl font-black text-[rgba(13,27,94)] ">Be Our Team!</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="careers-panel careers-panel-left rounded-xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-4 text-white shadow-[0_12px_24px_rgba(10,11,133,0.22)]">
            <div className={`space-y-2.5 ${showAllPositions ? 'max-h-[290px] overflow-y-auto pr-1' : ''}`}>
              {displayedPositions.map((pos, index) => (
                <div
                  key={pos.slug}
                  className="careers-row rounded-lg bg-[#110fa0] px-3 py-2.5"
                  style={{ '--career-delay': `${index * 70}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-black/30">
                        <Briefcase size={13} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold">{pos.title}</p>
                        <p className="text-[10px] text-white/70">{pos.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedSlug((prev) => (prev === pos.slug ? null : pos.slug))}
                      className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/55 hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      {expandedSlug === pos.slug ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedSlug === pos.slug ? 'mt-2 max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="rounded-md border border-white/15 bg-black/25 px-3 py-2.5 text-left">
                      <p className="text-[10px] font-semibold text-white/80">
                        {pos.location || 'Jakarta'} • {pos.experience || '2+ years'}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/88">
                        {pos.summary || 'This position is open for professionals who are passionate about technology and collaboration.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleApply(pos.title)}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-[#0a0b85] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e9eeff] hover:shadow-[0_8px_16px_rgba(0,0,0,0.24)] active:translate-y-0 active:scale-[0.98]"
                      >
                        <Mail size={12} />
                        Apply this Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAllPositions((prev) => {
                  const next = !prev;
                  if (!next) setExpandedSlug(null);
                  return next;
                });
              }}
              className="mt-3 rounded-full bg-white px-4 py-1.5 text-[10px] font-bold text-[#0a0b85] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e9eeff] hover:shadow-[0_8px_16px_rgba(0,0,0,0.24)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {showAllPositions ? 'View Less' : 'View More'}
            </button>
          </article>

          <article className="careers-panel careers-panel-right rounded-xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] p-6 text-white shadow-[0_12px_24px_rgba(10,11,133,0.22)] flex flex-col justify-center">
            <h3 className="text-2xl font-black">Get In Touch</h3>
            <p className="mt-2 text-[12px] leading-relaxed text-white/80">
              Interested in joining our team? Reach out through the channel that suits you best.
            </p>

            <div className="mt-6 space-y-5">
              <a
                href={`mailto:${careerEmail}`}
                className="group flex items-center gap-4 transition-colors"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-transform group-hover:scale-105 group-hover:bg-white/15">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
                    Email
                  </span>
                  <span className="mt-0.5 block text-[1.1rem] font-bold leading-tight text-white">
                    {careerEmail}
                  </span>
                </span>
              </a>

              <a
                href="tel:+622156975111"
                className="group flex items-center gap-4 transition-colors"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-transform group-hover:scale-105 group-hover:bg-white/15">
                  <Phone className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
                    Phone
                  </span>
                  <span className="mt-0.5 block text-[1.1rem] font-bold leading-tight text-white">
                    +6221-56975111/5222
                  </span>
                </span>
              </a>

              <a
                href="https://wa.me/628164850082?text=Hello%20Artha%20Mitra%20Interdata%2C%20I%20would%20like%20to%20discuss%20a%20career%20opportunity."
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-4 transition-colors"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#22c55e] ring-1 ring-white/15 transition-transform group-hover:scale-105 group-hover:bg-white/15">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-white/55">
                    WhatsApp
                  </span>
                  <span className="mt-0.5 block text-[1.1rem] font-bold leading-tight text-white">
                    +628164850082
                  </span>
                </span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
