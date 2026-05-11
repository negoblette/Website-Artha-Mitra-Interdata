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

const solutionIconMap = {
  "Network Security": Network,
  "Network Infrastructure": Server,
  "Network Monitoring": Siren,
  "Data Security": Database,
  "Application Security": ShieldCheck,
  "Endpoint Security": Cpu,
  "Information Security": FileWarning,
  "Security Management": Shield,
  "Secure Access & VPN": Lock,
  "Cloud Security": Cloud,
};

const serviceIconMap = {
  "Assessment": Search,
  "Design": GitBranch,
  "Implementation": Rocket,
  "Maintenance & Support": Headphones,
  "Training": Handshake,
  "Security Audit": ShieldAlert,
  "Asset Disposal Service": Server,
  "Awareness Event": ShieldPlus,
};

function OfferColumn({ eyebrow, title, items, icons, iconMap }) {
  const normalizedItems = items.map((item) =>
    typeof item === 'string'
      ? { name: item, description: 'Enterprise-grade support tailored for your operations.' }
      : item
  );

  return (
    <div className="h-full min-h-0 flex flex-col px-3 sm:px-7 py-4 sm:py-6">
      <div className="sticky top-0 z-10 bg-[#f4f5f7]/92 backdrop-blur-sm pb-3">
        <p className="text-[10px] sm:pl-50 font-bold tracking-[0.22em] text-[rgb(13,27,94)] uppercase">{eyebrow}</p>
        <h3 className="mt-1.5 text-2xl sm:text-4xl md:text-5xl sm:pl-50 font-extrabold text-[rgb(13,27,94)]">{title}</h3>
      </div>

      <div className="no-scrollbar mt-1.5 space-y-3 sm:space-y-4 overflow-y-auto sm:pl-50 sm:pr-50 flex-1 min-h-0">
        {normalizedItems.map((item, i) => {
          const Icon = iconMap?.[item.name] ?? icons[i % icons.length];

          return (
            <div key={`${item.name}-${i}`}>
              <p className="flex items-start gap-2 sm:gap-2.5 font-bold text-[rgb(13,27,94)] leading-tight">
                <Icon size={16} className="mt-1 text-[#007f99] sm:hidden flex-shrink-0" />
                <Icon size={19} className="mt-1 text-[#007f99] hidden sm:block flex-shrink-0" />
                <span className="text-[15px] sm:text-[18px] md:text-[21px]">{item.name}</span>
              </p>
              <p className="ml-6 sm:ml-7 text-[11px] sm:text-[14px] text-black mt-0.5 leading-snug">{item.description}</p>
            </div>
          );
        })}
      </div>

      <p className="text-center mt-3 text-sm sm:text-base font-bold text-[rgb(13,27,94)]">Scroll For More</p>
      <div className="text-center mt-2">
        <Link href="/solution" className="inline-flex rounded-full border-2 border-black px-5 sm:px-6 py-1.5 text-black text-sm sm:text-base font-semibold hover:bg-[rgba(13,27,94)] hover:text-white transition-colors">
          Learn More
        </Link>
      </div>
    </div>
  );
}

export default function OfferingsSection({ data }) {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="relative w-full bg-transparent border-t border-[#bebebe73] md:h-[70svh]">
      <div className="w-full h-full border-y border-[#dbdbdb] bg-white/22 backdrop-blur-[2px] overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          <div
            className={`border-b md:border-b-0 md:border-r border-[#dbdbdb] bg-[#f4f5f7]/82 h-full min-h-0 transition-all duration-300 ${hovered === 'right' ? 'md:opacity-45' : 'md:opacity-100'}`}
            onMouseEnter={() => setHovered('left')}
            onMouseLeave={() => setHovered(null)}
          >
            <OfferColumn
              eyebrow="The Infrastructure"
              title="Solutions"
              items={data.tabs[0].items}
              icons={leftIcons}
              iconMap={solutionIconMap}
            />
          </div>
          <div
            className={`bg-[#f2f3f5]/82 h-full min-h-0 transition-all duration-300 ${hovered === 'left' ? 'md:opacity-45' : 'md:opacity-100'}`}
            onMouseEnter={() => setHovered('right')}
            onMouseLeave={() => setHovered(null)}
          >
            <OfferColumn
              eyebrow="The Expertise"
              title="Services"
              items={data.tabs[1].items}
              icons={rightIcons}
              iconMap={serviceIconMap}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
