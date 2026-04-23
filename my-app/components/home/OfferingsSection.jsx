"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Server,
  Shield,
  Phone,
  Cpu,
  Database,
  Network,
  ShieldAlert,
  ShieldCheck,
  Siren,
  FileWarning,
  GitBranch,
  Handshake,
  Rocket,
  Headphones,
  Search,
  Lock,
  CloudCog,
  ShieldPlus,
  Cloud,
} from 'lucide-react';

const leftIcons = [Server, Shield, Phone, Cpu, Database, Network, ShieldAlert, ShieldCheck, Siren, FileWarning, GitBranch];
const rightIcons = [Handshake, Rocket, Headphones, Search, Cloud, Cpu, Shield, CloudCog, ShieldPlus, Lock];

function OfferColumn({ eyebrow, title, items, icons, cta }) {
  const normalizedItems = items.map((item) =>
    typeof item === 'string'
      ? { name: item, description: 'Enterprise-grade support tailored for your operations.' }
      : item
  );

  return (
    <div className="h-full min-h-0 flex flex-col px-4 sm:px-7 py-5 sm:py-6">
      <div className="sticky top-0 z-10 bg-[#f4f5f7]/92 backdrop-blur-sm pb-3">
        <p className="text-[10px] pl-50 font-bold tracking-[0.22em] text-[rgb(13,27,94)] uppercase">{eyebrow}</p>
        <h3 className="mt-1.5 text-4xl sm:text-5xl pl-50 font-extrabold text-[rgb(13,27,94)]">{title}</h3>
      </div>

      <div className="no-scrollbar ml-5 mt-2.5 space-y-7.5 overflow-y-auto pr-1 flex-1 min-h-0">
        {normalizedItems.map((item, i) => {
          const Icon = icons[i % icons.length];

          return (
            <div key={`${item.name}-${i}`}>
              <p className="flex items-start gap-2.5 font-bold text-[rgb(13,27,94)] leading-tight">
                <Icon size={19} className="mt-1 text-[#007f99]" />
                <span className="text-[18px] sm:text-[20px]">{item.name}</span>
              </p>
              <p className="ml-7 mt-0.5 text-[12px] sm:text-[14px] font-normal leading-snug text-black/78">{item.description}</p>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-3 text-base font-bold text-[rgb(13,27,94)]">scroll for more</p>
      <div className="text-center mt-2">
        <Link href={cta.href} className="inline-flex rounded-full border-2 border-black px-6 py-1.5 text-black text-sm sm:text-base font-semibold hover:bg-[#d7d9ff] hover:text-black transition-colors">
          {cta.label}
        </Link>
      </div>
    </div>
  );
}

export default function OfferingsSection({ data }) {
  const [hovered, setHovered] = useState(null);
  const [leftTab, rightTab] = data.tabs;

  return (
    <section className="relative w-full overflow-x-hidden border-t border-[#bebebe73] bg-white md:h-[calc(100svh-98px)]">
      <div className="pointer-events-none absolute inset-0 hidden md:grid md:grid-cols-2">
        <div className="border-r border-[#dbdbdb] bg-[#f4f5f7]/82" />
        <div className="bg-[#f2f3f5]/82" />
      </div>

      <div className="relative z-10 mx-auto h-full w-full max-w-[1200px] px-6 md:px-8">
        <div className="h-full overflow-hidden border-y border-[#dbdbdb] bg-transparent">
          <div className="grid h-full min-w-0 grid-cols-1 md:grid-cols-2">
            <div
              className={`h-full min-h-0 bg-[#f4f5f7]/82 transition-all duration-300 ${hovered === 'right' ? 'md:opacity-45' : 'md:opacity-100'}`}
              onMouseEnter={() => setHovered('left')}
              onMouseLeave={() => setHovered(null)}
            >
              <OfferColumn
                eyebrow={leftTab.eyebrow}
                title={leftTab.label}
                items={leftTab.items}
                icons={leftIcons}
                cta={data.cta}
              />
            </div>
            <div
              className={`h-full min-h-0 bg-[#f2f3f5]/82 transition-all duration-300 md:border-l md:border-[#dbdbdb] ${hovered === 'left' ? 'md:opacity-45' : 'md:opacity-100'}`}
              onMouseEnter={() => setHovered('right')}
              onMouseLeave={() => setHovered(null)}
            >
              <OfferColumn
                eyebrow={rightTab.eyebrow}
                title={rightTab.label}
                items={rightTab.items}
                icons={rightIcons}
                cta={data.cta}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}


