'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar({ data }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const isTransparentTopPage = pathname === '/' || pathname === '/about';
  const showSolidNavbar = scrolled || !isTransparentTopPage;
  const navItems = data.nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${showSolidNavbar ? 'bg-white/96 backdrop-blur-xl py-3 shadow-sm' : 'bg-transparent py-4'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <Link href="/" className="flex items-center group justify-self-start">
            <motion.div className="relative w-44 sm:w-48 h-12 sm:h-14 overflow-hidden" whileHover={{ scale: 1.03 }} transition={{ duration: 0.2 }}>
              <Image src={data.logo} alt={data.companyName} fill sizes="180px" className="object-contain object-left" priority />
            </motion.div>
          </Link>

          <motion.div
            className="hidden xl:flex h-12 items-center gap-0.5 bg-[rgb(13,27,94)] rounded-full px-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
          >
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                className="rounded-full"
                whileTap={{ boxShadow: '0 6px 14px rgba(0,0,0,0.32)' }}
                transition={{ duration: 0.12 }}
              >
                <Link
                  href={item.href}
                  className={`group relative inline-flex h-10 items-center px-5 rounded-full text-[13px] font-semibold transition-colors ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-white hover:text-white'
                  }`}
                >
                  <span className="inline-block transition-transform duration-150 group-hover:-translate-y-0.5">
                    {item.label}
                  </span>
                  <span
                    className={`pointer-events-none absolute left-5 right-5 bottom-1 h-0.5 origin-center rounded-full transition-transform duration-200 ${
                      pathname === item.href
                        ? 'scale-x-100 bg-white'
                        : 'scale-x-0 bg-white/90 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center justify-self-end gap-2">
            <motion.div
              whileTap={{ boxShadow: '0 6px 14px rgba(0,0,0,0.32)' }}
              transition={{ duration: 0.12 }}
            >
              <Link
                href="/contact"
                className="group hidden sm:inline-flex h-12 items-center bg-[rgb(13,27,94)] text-white hover:bg-[#1e1f92] rounded-full px-8 text-[13px] font-semibold transition-colors shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              >
                <span className="inline-block transition-transform duration-150 group-hover:-translate-y-0.5">Contact Us</span>
              </Link>
            </motion.div>

            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              className="xl:hidden p-2.5 text-[#111827] hover:bg-[#0a0b85] hover:text-white rounded-full transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/98 backdrop-blur-2xl"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    href={item.href}
                    className={`text-3xl tracking-wide transition-colors ${
                      pathname === item.href ? 'text-[#0a0b85] font-bold' : 'text-[#111827] hover:text-[#0a0b85]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.08 }}
              >
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 bg-[#0a0b85] text-white rounded-full px-8 py-3 text-sm font-semibold"
                >
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
