'use client';
import { motion } from 'framer-motion';
import { ArrowUpRight, Mail, MessageCircle, Phone } from 'lucide-react';

const FOCUS_LINES = [
  'Infrastructure',
  'Cybersecurity',
  'Networking',
  'Enterprise Support',
];

function normalizePhone(value = '') {
  return value.replace(/[^\d+]/g, '');
}

export default function ContactHero({ contact, whatsapp }) {
  const officePhone = contact?.phone?.split('/')?.[0] ?? contact?.phone ?? '';
  const officePhoneHref = normalizePhone(officePhone);
  const whatsappNumber = normalizePhone(whatsapp || contact?.whatsapp || officePhone);
  const whatsappHref = whatsappNumber.replace(/^\+/, '');
  const mailSubject = encodeURIComponent(`Inquiry from ${contact?.email ?? 'website contact page'}`);
  const mailBody = encodeURIComponent(
    'Hello Artha Mitra Interdata, I would like to get in touch regarding your services.',
  );

  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_48%,#f6f8ff_100%)]" />
      <div className="absolute inset-0 mesh-gradient-accent opacity-10" />
      <div className="absolute inset-0 grid-pattern opacity-[0.08]" />
      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-[#0a0b85]/10 blur-[120px]" />
      <div className="absolute right-0 top-20 h-[30rem] w-[30rem] rounded-full bg-[#7c8cff]/12 blur-[140px]" />
      <div className="absolute bottom-0 left-1/2 h-[24rem] w-[48rem] -translate-x-1/2 rounded-full bg-[#010268]/5 blur-[140px]" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-14 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[#0a0b85]/55">
            Get in touch
          </p>

          <h1 className="mt-6 text-5xl font-bold tracking-tight text-[#0f172a] sm:text-6xl lg:text-7xl">
            Let&#39;s build
            <span className="block bg-[linear-gradient(135deg,#0a0b85,#3651ff)] bg-clip-text text-transparent">
              a stronger connection
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#334155] sm:text-lg">
            Tell us what you are working on. We will help you find the right path, the right
            support, and the right next move without adding noise.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#0a0b85]/70">
            {FOCUS_LINES.map((item, index) => (
              <span key={item} className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#0a0b85]" />
                {item}
                {index < FOCUS_LINES.length - 1 ? <span className="text-[#c3cbea]">/</span> : null}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[28rem] lg:min-h-[34rem]"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(10,11,133,0.16)_0%,rgba(10,11,133,0.08)_34%,rgba(10,11,133,0.02)_58%,transparent_74%)] blur-[2px]" />
          </div>

          <div className="absolute left-[8%] top-[14%] h-36 w-36 rounded-full border border-[#0a0b85]/12 bg-white/20 backdrop-blur-sm" />
          <div className="absolute right-[12%] top-[30%] h-24 w-24 rounded-full border border-[#7c8cff]/16 bg-white/18 backdrop-blur-sm" />
          <div className="absolute bottom-[18%] left-[18%] h-20 w-20 rounded-full border border-[#0a0b85]/14 bg-white/14 backdrop-blur-sm" />
          <div className="absolute inset-x-10 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(10,11,133,0.22),transparent)]" />
          <div className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#0a0b85]/12" />
          <div className="absolute left-1/2 top-1/2 h-[16rem] w-[16rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#7c8cff]/18" />

          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute right-[18%] top-[12%] text-[10px] font-semibold uppercase tracking-[0.36em] text-[#0a0b85]/55"
          >
            Connect
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0], x: [0, -6, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-[14%] right-[10%] text-[10px] font-semibold uppercase tracking-[0.36em] text-[#64748b]"
          >
            Listen
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-1/2 w-[min(100%,24rem)] -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/55 bg-white/78 p-5 shadow-[0_24px_80px_rgba(10,11,133,0.14)] backdrop-blur-xl sm:p-6">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,255,255,0.56))]" />
              <div className="absolute right-[-5rem] top-[-6rem] h-40 w-40 rounded-full bg-[#0a0b85]/10 blur-[70px]" />
              <div className="relative z-10">
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[#0a0b85]/55">
                  Quick actions
                </p>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0f172a]">
                  Reach us in one tap
                </h2>
                <p className="mt-2 text-sm leading-7 text-[#334155]">
                  Choose the channel that suits you best. The office team will respond as soon as
                  possible.
                </p>

                <div className="mt-5 grid gap-3">
                  <motion.a
                    href={`tel:${officePhoneHref}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="group flex items-center justify-between rounded-2xl border border-[#0a0b85]/10 bg-white px-4 py-3.5 shadow-[0_10px_26px_rgba(10,11,133,0.08)] transition-colors hover:border-[#0a0b85]/20 hover:bg-[#f7f9ff]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0a0b85,#0f198d)] text-white">
                        <Phone size={16} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0a0b85]/55">
                          Call office
                        </span>
                        <span className="block text-sm font-semibold text-[#0f172a]">
                          {contact?.phone}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[#0a0b85]/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.a>

                  <motion.a
                    href={`https://wa.me/${whatsappHref}?text=${encodeURIComponent(
                      'Hello Artha Mitra Interdata, I would like to discuss a project.',
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="group flex items-center justify-between rounded-2xl border border-[#0a0b85]/10 bg-white px-4 py-3.5 shadow-[0_10px_26px_rgba(10,11,133,0.08)] transition-colors hover:border-[#0a0b85]/20 hover:bg-[#f7f9ff]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0a0b85,#0f198d)] text-white">
                        <MessageCircle size={16} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0a0b85]/55">
                          WhatsApp
                        </span>
                        <span className="block text-sm font-semibold text-[#0f172a]">
                          {whatsapp}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[#0a0b85]/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.a>

                  <motion.a
                    href={`mailto:${contact?.email}?subject=${mailSubject}&body=${mailBody}`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    className="group flex items-center justify-between rounded-2xl border border-[#0a0b85]/10 bg-white px-4 py-3.5 shadow-[0_10px_26px_rgba(10,11,133,0.08)] transition-colors hover:border-[#0a0b85]/20 hover:bg-[#f7f9ff]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0a0b85,#0f198d)] text-white">
                        <Mail size={16} />
                      </span>
                      <span className="text-left">
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0a0b85]/55">
                          Email us
                        </span>
                        <span className="block text-sm font-semibold text-[#0f172a]">
                          {contact?.email}
                        </span>
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[#0a0b85]/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

