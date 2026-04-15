'use client';
import { Sora } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const sora = Sora({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

export default function Footer({ data, companyName, logo, tagline, contact }) {
  const socials = data.socials.map((s) => ({ ...s, key: s.platform.toLowerCase() }));
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white border-t border-[#d9d9d9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-9 md:pt-10 pb-2 md:pb-2 md:min-h-[300px] flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11">
                <Image src={logo} alt={companyName} fill className="object-contain" />
              </div>
              <div>
                <p className="text-sm sm:text-[15px] font-semibold leading-tight text-[#1a1a1a]">{companyName}</p>
                <p className="text-[10px] leading-tight text-black/55">{tagline}</p>
              </div>
            </Link>
            <p className="mt-4 max-w-[280px] text-[11px] leading-relaxed text-black/60">Simply put, We Optimize IT For You.</p>

            <div className="mt-5 flex gap-3 text-black/90">
              {socials.map((social) => {
                const Icon = socialIcons[social.key];
                if (!Icon) return null;

                return (
                  <Link
                    key={social.platform}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center text-black/90 transition-colors hover:text-[#0a0b85]"
                  >
                    <Icon size={20} strokeWidth={2.2} />
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-7">
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-black/60">Quick Links</h4>
              <ul className="mt-3 space-y-2">
                {data.columns[0].links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[12px] leading-tight text-black/70 hover:text-[#0a0b85]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-black/60">Solutions</h4>
              <ul className="mt-3 space-y-2">
                {data.columns[1].links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[12px] leading-tight text-black/70 hover:text-[#0a0b85]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-black/60">Careers</h4>
              <ul className="mt-3 space-y-2">
                {data.columns[4].links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[12px] leading-tight text-black/70 hover:text-[#0a0b85]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-wide text-black/60">Contact</h4>
              <div className="mt-3 space-y-2.5 text-[12px] leading-snug text-black/70">
                <p className="flex items-start gap-2"><MapPin size={13} className="mt-0.5 flex-shrink-0" />{contact.address}</p>
                <p className="flex items-start gap-2"><Phone size={13} className="mt-0.5 flex-shrink-0" />{contact.phone}</p>
                <p className="flex items-start gap-2"><Mail size={13} className="mt-0.5 flex-shrink-0" />{contact.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 border-t border-[#ececec] pt-3 text-center text-[10px] text-black/45">
          © {year} PT. {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

