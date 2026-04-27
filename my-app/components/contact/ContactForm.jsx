'use client';
import Link from 'next/link';
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import AnimatedSection from '@/components/AnimatedSection';

<<<<<<< HEAD
export default function ContactForm({ contact }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const formBg =
    'bg-[linear-gradient(135deg,#0a0b85_0%,#121b9d_42%,#192bca_100%)]';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error || 'Failed to send message.');
      }

      setSubmitStatus({ type: 'success', message: 'Message sent successfully. We will get back to you soon.' });
      setForm({ name: '', company: '', email: '', phone: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message || 'Failed to send message.' });
    } finally {
      setIsSubmitting(false);
    }
  };
=======
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
>>>>>>> 1ddc4a1 (update contact + insight)

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

<<<<<<< HEAD
                  <div className="space-y-5">
                    <div className="group flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#010268]/15 bg-[linear-gradient(135deg,#0a0b85,#0f198d)] shadow-[0_10px_24px_rgba(10,11,133,0.18)] transition-all duration-200 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-[#0f198d]/25">
                        <MapPin size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[1.02rem] font-medium text-[#0f172a]">Address</p>
                        <p className="text-[1.02rem] leading-7 text-[#475569]">{contact.address}</p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#010268]/15 bg-[linear-gradient(135deg,#0a0b85,#0f198d)] shadow-[0_10px_24px_rgba(10,11,133,0.18)] transition-all duration-200 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-[#0f198d]/25">
                        <Phone size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[1.02rem] font-medium text-[#0f172a]">Phone</p>
                        <p className="text-[1.02rem] text-[#475569]">{contact.phone}</p>
                      </div>
                    </div>

                    <div className="group flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-[#010268]/15 bg-[linear-gradient(135deg,#0a0b85,#0f198d)] shadow-[0_10px_24px_rgba(10,11,133,0.18)] transition-all duration-200 group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-[#0f198d]/25">
                        <Mail size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="mb-0.5 text-[1.02rem] font-medium text-[#0f172a]">Email</p>
                        <p className="text-[1.02rem] text-[#475569]">{contact.email}</p>
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
              <div>
                <h2 className="mb-10 text-[20px] font-bold uppercase tracking-[0.36em] text-white/85">
                    Contact Form
                </h2>
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.10),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]" />
              <form
                onSubmit={handleSubmit}
                className="relative z-10 flex h-full min-h-[calc(78vh-7rem)] w-full flex-col space-y-5 bg-transparent"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                      <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white/90">
                        Name
                      </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/94 px-4 py-3 text-base text-[#101964] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#101964]/55 transition-all focus:border-white/45 focus:outline-none focus:ring-1 focus:ring-white/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                      <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white/90">
                        Company
                      </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/94 px-4 py-3 text-base text-[#101964] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#101964]/55 transition-all focus:border-white/45 focus:outline-none focus:ring-1 focus:ring-white/20"
                      placeholder="Company name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                      <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white/90">
                        Email
                      </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full rounded-xl border border-white/15 bg-white/94 px-4 py-3 text-base text-[#101964] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#101964]/55 transition-all focus:border-white/45 focus:outline-none focus:ring-1 focus:ring-white/20"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                      <label className="mb-2 block text-sm font-medium uppercase tracking-wider text-white/90">
                        Phone
                      </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-white/94 px-4 py-3 text-base text-[#101964] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#101964]/55 transition-all focus:border-white/45 focus:outline-none focus:ring-1 focus:ring-white/20"
                      placeholder="+62..."
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium uppercase tracking-wider text-white/90">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={3}
                    required
                    className="w-full min-h-[140px] resize-none rounded-xl border border-white/15 bg-white/94 px-4 py-3 text-base text-[#101964] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] placeholder:text-[#101964]/55 transition-all focus:border-white/45 focus:outline-none focus:ring-1 focus:ring-white/20"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  className="mt-5 inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-8 py-3.5 text-base font-semibold text-[#0a0b85] shadow-[0_16px_34px_rgba(255,255,255,0.18)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(255,255,255,0.24)]"
                >
                  <Send size={16} />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
                {submitStatus.message ? (
                  <p className={`text-sm font-medium ${submitStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                    {submitStatus.message}
                  </p>
                ) : null}
              </form>
            </AnimatedSection>
          </div>
=======
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
>>>>>>> 1ddc4a1 (update contact + insight)
        </div>
      </div>
    </section>
  );
}
