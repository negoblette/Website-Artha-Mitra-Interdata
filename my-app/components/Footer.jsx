'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const socialIcons = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

export default function Footer({ data, companyName, logo, tagline, contact }) {
  const staticCompanyName = 'Artha Mitra Interdata';
  const staticLogo = '/logo.png';
  const staticTagline = 'we optimize IT for you';
  const staticContact = {
    address: 'Jl. Dr. Makaliwe I No.24D, Jakarta 11450, Indonesia',
    phone: '+6221-56975111/5222',
    email: 'info@arthamitra.co.id',
  };
  const staticSocials = [
    { platform: 'facebook', href: 'https://www.facebook.com/arthamitrainterdatapt' },
    { platform: 'instagram', href: 'https://www.instagram.com/arthamitrainterdata?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==' },
    { platform: 'linkedin', href: 'https://www.linkedin.com/company/artha-mitra-interdata/' },
  ];
  const staticColumns = {
    quickLinks: [
      { href: '/', label: 'Home' },
      { href: '/about', label: 'About Us' },
      { href: '/products', label: 'Products' },
      { href: '/activities', label: 'Activities' },
      { href: '/insight', label: 'Insight' },
      { href: '/contact', label: 'Contact' },
    ],
    solutions: [
      { href: '/solution', label: 'Network Infrastructure' },
      { href: '/solution', label: 'IT Security' },
      { href: '/solution', label: 'Network Monitoring' },
      { href: '/solution', label: 'Secure Access & VPN' },
    ],
    careers: [
      { href: '/about', label: 'Life at AMI' },
      { href: '/about', label: 'Join Us' },
      { href: '/about', label: 'Open Roles' },
    ],
  };

  const socials = staticSocials.map((s) => ({ ...s, key: s.platform.toLowerCase() }));
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-white border-t border-[#d9d9d9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-9 md:pt-10 pb-2 md:pb-2 md:min-h-[300px] flex flex-col justify-between">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-4">
            <Link href="/" className="inline-block">
              <div className="relative w-44 sm:w-48 h-12 sm:h-14">
                <Image src={staticLogo} alt={staticCompanyName} fill sizes="180px" className="object-contain object-left" />
              </div>
            </Link>
            <p className="mt-2 text-[11px] sm:text-xs font-medium text-black/50">{staticTagline}</p>

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
              <h4 className="text-[14px] font-bold uppercase tracking-wide text-black">Quick Links</h4>
              <ul className="mt-3 space-y-2">
                {staticColumns.quickLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[14px] leading-tight text-black/70 hover:text-[#0a0b85]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-wide text-black">Solutions</h4>
              <ul className="mt-3 space-y-2">
                {staticColumns.solutions.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[14px] leading-tight text-black/70 hover:text-[#0a0b85]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-wide text-black">Careers</h4>
              <ul className="mt-3 space-y-2">
                {staticColumns.careers.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-[14px] leading-tight text-black/70 hover:text-[#0a0b85]">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold uppercase tracking-wide text-black">Contact</h4>
              <div className="mt-3 space-y-2.5 text-[14px] leading-snug text-black/70">
                <p className="flex items-start gap-2"><MapPin size={13} className="mt-0.5 flex-shrink-0" />{staticContact.address}</p>
                <p className="flex items-start gap-2"><Phone size={13} className="mt-0.5 flex-shrink-0" />{staticContact.phone}</p>
                <p className="flex items-start gap-2"><Mail size={13} className="mt-0.5 flex-shrink-0" />{staticContact.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 border-t border-[#ececec] pt-3 text-center text-[10px] text-black/45">
          © {year} PT. {staticCompanyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

