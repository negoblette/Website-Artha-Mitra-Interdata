'use client';
import { useState } from 'react';
import { Briefcase, Upload } from 'lucide-react';

export default function CareersSection({ data }) {
  const [cvForm, setCvForm] = useState({ name: '', email: '' });
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [showAllPositions, setShowAllPositions] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('No file selected');

  const displayedPositions = showAllPositions
    ? data.positions
    : data.positions.slice(0, 3);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your CV has been submitted.');
    setCvForm({ name: '', email: '' });
    setSelectedFileName('No file selected');
  };

  return (
    <section id="careers" className="relative flex min-h-screen items-center bg-transparent py-16">
      <img 
        src="decor/careerelements.svg" 
        alt="" 
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 w-full h-full object-cover opacity-100"
      />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <h2 className="text-center text-4xl font-black text-[#0a0b85]">Be Our Team!</h2>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="careers-panel careers-panel-left rounded-xl bg-[#0a0b85] p-4 text-white shadow-[0_12px_24px_rgba(10,11,133,0.22)]">
            <div className={`space-y-2.5 ${showAllPositions ? 'max-h-[290px] overflow-y-auto pr-1' : ''}`}>
              {displayedPositions.map((pos, index) => (
                <div
                  key={pos.slug}
                  className="careers-row rounded-lg bg-[#110fa0] px-3 py-2.5"
                  style={{ '--career-delay': `${index * 70}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-black/30">
                        <Briefcase size={13} />
                      </span>
                      <div>
                        <p className="text-xs font-semibold">{pos.title}</p>
                        <p className="text-[10px] text-white/70">{pos.type}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setExpandedSlug((prev) => (prev === pos.slug ? null : pos.slug))}
                      className="rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/55 hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    >
                      {expandedSlug === pos.slug ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandedSlug === pos.slug ? 'mt-2 max-h-40 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="rounded-md border border-white/15 bg-black/25 px-3 py-2.5 text-left">
                      <p className="text-[10px] font-semibold text-white/80">
                        {pos.location || 'Jakarta'} • {pos.experience || '2+ years'}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/88">
                        {pos.summary || 'This position is open for professionals who are passionate about technology and collaboration.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowAllPositions((prev) => {
                  const next = !prev;
                  if (!next) setExpandedSlug(null);
                  return next;
                });
              }}
              className="mt-3 rounded-full bg-white px-4 py-1.5 text-[10px] font-bold text-[#0a0b85] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#e9eeff] hover:shadow-[0_8px_16px_rgba(0,0,0,0.24)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              {showAllPositions ? 'View Less' : 'View More'}
            </button>
          </article>

          <article className="careers-panel careers-panel-right rounded-xl bg-[#0a0b85] p-4 text-white shadow-[0_12px_24px_rgba(10,11,133,0.22)]">
            <h3 className="text-2xl font-black">{data.cvForm.title}</h3>
            <p className="mt-2 text-[11px] leading-relaxed text-white/85">{data.cvForm.description}</p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-2.5">
              <input
                type="text"
                placeholder="Enter Your Name Here"
                value={cvForm.name}
                onChange={(e) => setCvForm({ ...cvForm, name: e.target.value })}
                required
                className="w-full rounded-md border border-[#d1d5ff] bg-white px-3 py-2 text-xs text-[#0a0b85] placeholder:text-[#0a0b85]/45 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Enter Your Email Here"
                value={cvForm.email}
                onChange={(e) => setCvForm({ ...cvForm, email: e.target.value })}
                required
                className="w-full rounded-md border border-[#d1d5ff] bg-white px-3 py-2 text-xs text-[#0a0b85] placeholder:text-[#0a0b85]/45 focus:outline-none"
              />

              <p className="text-[10px] leading-relaxed text-white/80">{data.cvForm.note}</p>

              <div className="flex items-center gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/20 bg-black/35 px-3 py-2 text-[10px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-black/55 hover:shadow-[0_8px_16px_rgba(0,0,0,0.25)] active:translate-y-0 active:scale-[0.98] focus-within:outline-none focus-within:ring-2 focus-within:ring-white/60">
                  <Upload size={12} />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpeg,.jpg"
                    onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || 'No file selected')}
                  />
                </label>
                <span className="text-[10px] text-white/70">{selectedFileName} (Max {data.cvForm.maxFileSize})</span>
                <button
                  type="submit"
                  className="ml-auto rounded-md bg-black px-4 py-2 text-[10px] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#050505] hover:shadow-[0_8px_16px_rgba(0,0,0,0.35)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Send
                </button>
              </div>
            </form>
          </article>
        </div>
      </div>
    </section>
  );
}
