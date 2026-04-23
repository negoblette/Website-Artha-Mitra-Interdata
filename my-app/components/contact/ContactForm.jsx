'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

export default function ContactForm({ contact }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setForm({ name: '', company: '', email: '', phone: '', message: '' });
  };

  return (
<<<<<<< Updated upstream
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[#ffffff]" />
      <div className="absolute inset-0 dot-pattern opacity-30" />
=======
    <section className="relative z-10 py-20 overflow-visible">
      <div className="absolute inset-0 z-0 bg-[#ffffff]" />
      <div className="absolute inset-0 z-0 dot-pattern opacity-30" />
      <img
        src="/decor/contactform.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute left-[-27rem] top-[27rem] z-10 h-[140%] w-auto -translate-y-1/2 opacity-100"
      />
      {/* <div className="absolute inset-0 z-10 bg-gradient-to-r from-white via-white/75 to-white/10" /> */}
>>>>>>> Stashed changes

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact info column */}
          <AnimatedSection direction="left" className="lg:col-span-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#111827] mb-2">Let&#39;s talk</h2>
                <p className="text-[#111827] text-sm leading-relaxed">
                  Fill out the form and our team will get back to you within 24 hours.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-[#010268]/8 border border-[#010268]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010268]/14 transition-colors">
                    <MapPin size={18} className="text-[#010268]" />
                  </div>
                  <div>
                    <p className="text-[#111827] text-sm font-medium mb-0.5">Address</p>
                    <p className="text-[#111827] text-sm leading-relaxed">{contact.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-[#010268]/8 border border-[#010268]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010268]/14 transition-colors">
                    <Phone size={18} className="text-[#010268]" />
                  </div>
                  <div>
                    <p className="text-[#111827] text-sm font-medium mb-0.5">Phone</p>
                    <p className="text-[#111827] text-sm">{contact.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 group">
                  <div className="w-11 h-11 rounded-xl bg-[#010268]/8 border border-[#010268]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#010268]/14 transition-colors">
                    <Mail size={18} className="text-[#010268]" />
                  </div>
                  <div>
                    <p className="text-[#111827] text-sm font-medium mb-0.5">Email</p>
                    <p className="text-[#111827] text-sm">{contact.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form column */}
          <AnimatedSection delay={0.2} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass-card-glow rounded-2xl p-8 sm:p-10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#111827] text-xs font-medium tracking-wider uppercase mb-2 block">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-[#f3f4f6] border border-[#d1d5db] rounded-xl px-4 py-3 text-[#111827] text-sm placeholder:text-[#d1d5db] focus:outline-none focus:border-[#010268]/50 focus:ring-1 focus:ring-[#010268]/20 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="text-[#111827] text-xs font-medium tracking-wider uppercase mb-2 block">Company</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full bg-[#f3f4f6] border border-[#d1d5db] rounded-xl px-4 py-3 text-[#111827] text-sm placeholder:text-[#d1d5db] focus:outline-none focus:border-[#010268]/50 focus:ring-1 focus:ring-[#010268]/20 transition-all"
                    placeholder="Company name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[#111827] text-xs font-medium tracking-wider uppercase mb-2 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full bg-[#f3f4f6] border border-[#d1d5db] rounded-xl px-4 py-3 text-[#111827] text-sm placeholder:text-[#d1d5db] focus:outline-none focus:border-[#010268]/50 focus:ring-1 focus:ring-[#010268]/20 transition-all"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="text-[#111827] text-xs font-medium tracking-wider uppercase mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#f3f4f6] border border-[#d1d5db] rounded-xl px-4 py-3 text-[#111827] text-sm placeholder:text-[#d1d5db] focus:outline-none focus:border-[#010268]/50 focus:ring-1 focus:ring-[#010268]/20 transition-all"
                    placeholder="+62..."
                  />
                </div>
              </div>
              <div>
                <label className="text-[#111827] text-xs font-medium tracking-wider uppercase mb-2 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  required
                  className="w-full bg-[#f3f4f6] border border-[#d1d5db] rounded-xl px-4 py-3 text-[#111827] text-sm placeholder:text-[#d1d5db] focus:outline-none focus:border-[#010268]/50 focus:ring-1 focus:ring-[#010268]/20 transition-all resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-gradient-to-r from-[#010268] to-[#1a1b78] hover:from-[#1a1b78] hover:to-[#010268] text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gray-300/50"
              >
                <Send size={16} />
                Send Message
              </motion.button>
            </form>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

