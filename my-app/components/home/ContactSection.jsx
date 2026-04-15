'use client';

import { useState } from 'react';
import { Facebook, Instagram, Linkedin, MapPin } from 'lucide-react';


export default function ContactSection() {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent.');
    setForm({ name: '', company: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="home-section section-last relative bg-transparent overflow-hidden -mt-6 md:-mt-8 pt-8 md:pt-10 pb-10 md:pb-12">
      <div className="relative z-10 max-w-6xl mx-auto pt-20 pb-50 px-4 sm:px-6 grid grid-cols-1 md:grid-cols-[0.95fr_1.35fr_1fr] gap-6 md:gap-8 items-start">
        <div className="pt-1">
          <p className="text-xs tracking-[0.16em] font-bold text-black">CONTACT US</p>
          <h2 className="mt-2 text-4xl sm:text-5xl leading-[0.92] font-black text-black">GET IN TOUCH<br />WITH US</h2>

          <div className="mt-10 space-y-4 text-black">
            <p className="flex items-center gap-3 text-sm font-semibold"><Instagram size={21} />@arthamitrainterdata</p>
            <p className="flex items-center gap-3 text-sm font-semibold"><Facebook size={21} />@arthamitrainterdata</p>
            <p className="flex items-center gap-3 text-sm font-semibold"><Linkedin size={21} />@arthamitrainterdata</p>
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

          <button type="submit" className="inline-flex mt-2 rounded-xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] text-white px-5 py-2 text-sm font-semibold shadow-sm hover:bg-[#08096e] transition-colors">
            Send Message
          </button>
        </form>

        <div className="rounded-xl bg-gradient-to-br from-[rgb(20,40,120)] to-[rgb(10,20,70)] min-h-[330px] md:min-h-[360px] md:mt-5 flex items-center justify-center text-black">
          <MapPin size={35} />
        </div>
      </div>
    </section>
  );
}


