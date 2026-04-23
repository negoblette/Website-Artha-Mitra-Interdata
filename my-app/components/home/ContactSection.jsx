'use client';

import { useState } from 'react';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const socialIcons = {
  Facebook,
  Instagram,
  LinkedIn: Linkedin,
};

export default function ContactSection({ data, contact, socials = [] }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent.');
    setForm({ name: '', company: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="home-section section-last relative mt-12 md:mt-16 bg-transparent overflow-visible pt-8 md:pt-10 pb-10 md:pb-12">
      <img 
        src="/decor/contactelements.svg" 
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-[-8rem] z-0 w-full object-cover opacity-30 max-[639px]:left-1/2 max-[639px]:top-[1rem] max-[639px]:bottom-auto max-[639px]:w-[900px] max-[639px]:max-w-none max-[639px]:-translate-x-1/2 max-[639px]:object-contain min-[640px]:max-[1023px]:left-1/2 min-[640px]:max-[1023px]:top-[4rem] min-[640px]:max-[1023px]:bottom-auto min-[640px]:max-[1023px]:w-[980px] min-[640px]:max-[1023px]:max-w-none min-[640px]:max-[1023px]:-translate-x-1/2 min-[640px]:max-[1023px]:object-contain" 
      />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-[0.95fr_1.35fr_1fr] gap-6 md:gap-8 items-start">
        <div className="pt-1">
          <p className="text-xs tracking-[0.16em] font-bold text-black uppercase">{data.eyebrow}</p>
          <h2 className="mt-2 text-4xl sm:text-5xl leading-[0.92] font-black text-black">{data.title}</h2>

          <div className="mt-10 space-y-4 text-black">
            {data.socials.map((item) => {
              const Icon = socialIcons[item.platform];
              const href = socials.find((entry) => entry.platform === item.platform)?.href || '#';

              return (
                <a
                  key={item.platform}
                  href={href}
                  className="flex items-center gap-3 text-sm font-semibold text-black hover:text-[#0a0b85] transition-colors"
                >
                  <Icon size={21} />
                  {item.label}
                </a>
              );
            })}
            <p className="flex items-start gap-3 text-sm font-semibold">
              <Phone size={21} className="mt-0.5 shrink-0" />
              <span>{contact.phone}</span>
            </p>
            <p className="flex items-start gap-3 text-sm font-semibold">
              <Mail size={21} className="mt-0.5 shrink-0" />
              <span>{contact.email}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {['name', 'company', 'email'].map((field) => (
            <div key={field}>
              <label className="block text-[11px] tracking-wide font-bold uppercase text-black mb-1">{field}</label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                required={field !== 'company'}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full h-10 rounded-xl bg-white border border-[rgba(13,27,94)] text-black px-4 outline-none"
              />
            </div>
          ))}
          
          <div>
            <label className="block text-[11px] tracking-wide font-bold uppercase text-black mb-1">message</label>
            <textarea
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-xl bg-white border border-[#0a0b85] text-black px-4 py-2.5 outline-none resize-none"
            />
          </div>

          <button type="submit" className="inline-flex mt-2 rounded-xl bg-[#0a0b85] text-white px-5 py-2 text-sm font-semibold shadow-sm hover:bg-[#08096e] transition-colors">
            {data.form.submitLabel}
          </button>
        </form>

        <div className="rounded-xl bg-[#22007f] min-h-[330px] md:min-h-[338px] md:mt-5 p-6 text-white flex flex-col justify-between">
          <div>
            <MapPin size={44} />
            <p className="mt-5 text-sm leading-relaxed">{contact.address}</p>
          </div>
          <div className="text-sm font-medium">
            <p>{contact.phone}</p>
            <p className="mt-1">{contact.email}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
