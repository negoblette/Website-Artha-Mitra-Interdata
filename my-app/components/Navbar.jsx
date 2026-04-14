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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolidNavbar
            ? 'bg-gradient-to-b from-white/96 via-[#fafbfc]/95 to-[#f6f7fa]/94 backdrop-blur-xl py-3 shadow-sm'
            : 'bg-transparent py-4'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-[auto_1fr_auto] items-center gap-3 md:gap-4">
          <Link href="/" className="flex items-center group justify-self-start">
            <motion.div
              className="relative h-11 w-32 overflow-hidden sm:h-12 sm:w-40 lg:h-14 lg:w-48"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Image src={data.logo} alt={data.companyName} fill className="object-contain object-left" priority />
            </motion.div>
          </Link>

          <motion.div
            className="hidden lg:flex justify-self-center h-12 max-w-max items-center gap-0.5 rounded-full bg-[#0a0b85] px-2 shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
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
                  className={`group relative inline-flex h-10 items-center px-3 xl:px-5 rounded-full text-sm xl:text-[15px] font-semibold transition-colors ${
                    pathname === item.href
                      ? 'text-white'
                      : 'text-white hover:text-white'
                  }`}
                >
                  <span className="inline-block transition-transform duration-150 group-hover:-translate-y-0.5">
                    {item.label}
                  </span>
                  <span
                    className={`pointer-events-none absolute left-3 right-3 bottom-1 h-0.5 origin-center rounded-full transition-transform duration-200 xl:left-5 xl:right-5 ${
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
                className="group hidden md:inline-flex h-11 lg:h-12 items-center rounded-full bg-[#0a0b85] px-5 lg:px-7 text-sm lg:text-[15px] font-semibold text-white transition-colors hover:bg-[#1e1f92] shadow-[0_4px_10px_rgba(0,0,0,0.25)]"
              >
                <span className="inline-block transition-transform duration-150 group-hover:-translate-y-0.5">Contact Us</span>
              </Link>
            </motion.div>

            <motion.button
              onClick={() => setMobileOpen(!mobileOpen)}
              whileTap={{ scale: 0.9 }}
              className={`lg:hidden rounded-full p-2.5 transition-colors ${
                showSolidNavbar
                  ? 'text-[#111827] hover:bg-[#0a0b85] hover:text-white'
                  : 'text-[#0a0b85] bg-white/85 backdrop-blur hover:bg-[#0a0b85] hover:text-white'
              }`}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
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
            className="fixed inset-0 z-40 overflow-y-auto bg-gradient-to-b from-white via-[#fafbfc] to-[#f6f7fa] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(1,2,104,0.08),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(115,115,115,0.08),_transparent_24%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.04)_1px,transparent_1px)] bg-[size:34px_34px]" />

            <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 px-4 pb-10 pt-28 sm:px-6">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.08 }}
                  className="text-center"
                >
                  <Link
                    href={item.href}
                    className={`text-2xl sm:text-3xl tracking-wide transition-colors ${
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
                className="text-center"
              >
                <Link
                  href="/contact"
                  className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0a0b85] px-8 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(10,11,133,0.18)]"
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
