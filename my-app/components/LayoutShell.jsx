'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function LayoutShell({ globalData, children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    let rafId = 0;
    let lateInitTimer;
    let targets = [];

    const reveal = (el) => {
      el.classList.add('in-view');
      el.style.opacity = '1';
      el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      el.style.filter = 'blur(0px)';
    };

    const checkInView = () => {
      const triggerPoint = window.innerHeight * 0.88;

      targets.forEach((el) => {
        if (el.dataset.revealed === 'true') return;

        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
          el.dataset.revealed = 'true';
          reveal(el);
        }
      });
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        checkInView();
        rafId = 0;
      });
    };

    const initReveal = () => {
      targets = Array.from(document.querySelectorAll('main section:not([data-no-reveal="true"])'));
      if (!targets.length) return;

      targets.forEach((el, index) => {
        const delay = Math.min(index * 0.04, 0.24);
        const fromLeft = index % 2 === 0;
        const startX = fromLeft ? -72 : 72;

        el.classList.add('scroll-reveal');
        el.style.opacity = '0';
        el.style.transform = `translate3d(${startX}px, 0, 0) scale(0.995)`;
        el.style.filter = 'blur(5px)';
        el.style.transition = 'opacity 0.72s cubic-bezier(0.22, 1, 0.36, 1), transform 0.72s cubic-bezier(0.22, 1, 0.36, 1), filter 0.72s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transitionDelay = `${delay}s`;
        el.dataset.revealed = 'false';
      });

      checkInView();
    };

    initReveal();
    lateInitTimer = window.setTimeout(initReveal, 220);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.clearTimeout(lateInitTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname, isAdmin]);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar data={globalData} />
      <main className="flex-1">{children}</main>
      <Footer
        data={globalData.footer}
        companyName={globalData.companyName}
        logo={globalData.logo}
        tagline={globalData.tagline}
        contact={globalData.contact}
      />
      {globalData.whatsapp && pathname !== '/' && (
        <WhatsAppButton phoneNumber={globalData.whatsapp} />
      )}
    </div>
  );
}
