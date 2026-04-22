'use client';
import AnimatedSection from '@/components/AnimatedSection';

export default function ContactInfo({ contact, mapUrl }) {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-[#fafbfc] to-[#f6f7fa]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatedSection>
          <div className="glass-card-glow rounded-2xl overflow-hidden">
            <iframe
              src={contact.mapEmbedUrl || mapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
              className="w-full"
            />
            {contact.mapLink && (
              <div className="flex items-center justify-between gap-3 border-t border-black/5 bg-white px-4 py-3 text-sm text-[#111827]">
                <span className="font-medium">Tidak bisa melihat map?</span>
                <a
                  href={contact.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full bg-[#0a0b85] px-4 py-2 font-semibold text-white transition-colors hover:bg-[#08096e]"
                >
                  Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

