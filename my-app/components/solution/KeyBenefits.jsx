// 'use client';
// import { motion } from 'framer-motion';
// import { Mountain } from 'lucide-react';
// import AnimatedSection from '@/components/AnimatedSection';

// export default function KeyBenefits({ data }) {
//   return (
//     <section className="relative py-28 overflow-hidden">

//       <div className="absolute top-12 left-12 grid grid-cols-6 gap-2.5 opacity-15">
//         {Array.from({ length: 24 }).map((_, i) => (
//           <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#737373]" />
//         ))}
//       </div>

//       <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
//         <AnimatedSection>
//           <div className="text-center mb-16">
//             <span className="font-[family-name:var(--font-sora)] inline-block text-[#737373] text-xs font-semibold tracking-[0.3em] uppercase mb-4">
//               Why Us
//             </span>
//             <h2 className="font-[family-name:var(--font-sora)] text-3xl sm:text-4xl font-bold gradient-text inline-block mb-4">
//               {data.title}
//             </h2>
//             <p className="text-[#111827] text-sm">{data.subtitle}</p>
//           </div>
//         </AnimatedSection>

//         {/* Benefits grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {data.items.map((item, i) => (
//             <AnimatedSection
//               key={i}
//               delay={i * 0.1}
//               direction={i % 2 === 0 ? 'left' : 'right'}
//             >
//               <motion.div
//                 whileHover={{ scale: 1.02, y: -4 }}
//                 transition={{ duration: 0.2 }}
//                 className="gradient-border group"
//               >
//                 <div className="flex items-start gap-4 p-6 glass-card rounded-2xl">
//                   <div className="w-28 h-20 rounded-xl bg-gradient-to-br from-[#f8fafc] to-[#eef2f7] flex items-center justify-center flex-shrink-0 overflow-hidden shadow-lg shadow-gray-300/20">
//                     <Mountain className="text-[#111827] group-hover:scale-110 transition-transform duration-500" size={24} />
//                   </div>
//                   <p className="text-[#111827] text-sm leading-relaxed pt-1">
//                     {item.text}
//                   </p>
//                 </div>
//               </motion.div>
//             </AnimatedSection>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

//wth ini gakepake samsek knp di dump?!?
