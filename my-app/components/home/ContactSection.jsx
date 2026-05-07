'use client';

import Link from 'next/link';
import { ArrowRight, MessageCircle, Instagram, Facebook, Linkedin } from 'lucide-react';

export default function ContactSection({ data, contact, socials, whatsapp }) {
  const waNumber = whatsapp || contact?.whatsapp || '+628164850082';
  const waHref = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello Artha Mitra Interdata, I would like to discuss a project.')}`;

  return (
    <section id="contact" className="relative bg-transparent overflow-hidden pt-8 pb-8 sm:pt-10 sm:pb-10 md:pt-14 md:pb-12">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Label */}
        <p className="text-[10px] sm:text-xs tracking-[0.2em] font-bold text-[#0a0b85]/60 uppercase">Contact Us</p>

        {/* Headline */}
        <h2 className="mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1] sm:leading-[0.95] text-[rgb(13,27,94)]">
          Let&apos;s Build Something
          <br />
          <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #0a0b85 0%, #2f54eb 100%)' }}>
            Great Together
          </span>
        </h2>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-5 mx-auto max-w-xl text-xs sm:text-base leading-relaxed font-medium text-black/65 px-2 sm:px-0">
          Have a project in mind or need IT consultation? We&apos;d love to hear from you. Reach out and let&apos;s start the conversation.
        </p>

        {/* CTA Buttons */}
        <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full px-5 sm:px-7 py-3 sm:py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(10,11,133,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(10,11,133,0.35)] active:translate-y-0 active:scale-[0.98]"
            style={{ background: 'linear-gradient(135deg, #0a0b85 0%, #141878 50%, #0a0b85 100%)' }}
          >
            Get In Touch
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 sm:gap-2.5 rounded-full border-2 border-[#25D366] px-5 sm:px-7 py-2.5 sm:py-3 text-sm font-bold text-[#128C7E] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#25D366] hover:text-white hover:shadow-[0_12px_28px_rgba(37,211,102,0.25)] active:translate-y-0 active:scale-[0.98]"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>

        {/* Social links */}
        <div className="mt-6 sm:mt-10 flex items-center justify-center gap-4 sm:gap-5">
          {(socials || []).map((social) => {
            const Icon = social.platform === 'Instagram' ? Instagram
              : social.platform === 'Facebook' ? Facebook
              : social.platform === 'LinkedIn' ? Linkedin
              : null;
            if (!Icon) return null;
            return (
              <a
                key={social.platform}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-black/50 transition-colors duration-200 hover:text-[#0a0b85]"
                aria-label={social.platform}
              >
                <Icon size={16} className="sm:hidden" />
                <Icon size={18} className="hidden sm:block" />
                <span className="hidden sm:inline">@arthamitrainterdata</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
