import { getContent } from '@/lib/content';
import { isSectionVisible } from '@/lib/sectionVisibility';
import ActivitiesHero from '@/components/activities/ActivitiesHero';
import ProgramsSection from '@/components/activities/ProgramsSection';
import EventsSection from '@/components/activities/EventsSection';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Activities - Artha Mitra Interdata',
  description: 'Our latest events, programs, and activities.',
};

export default function ActivitiesPage() {
  const data = getContent('activities');

  // Konfigurasi dekorasi background untuk viewport mobile.
  // Nilai posisi dan ukuran dipisah agar mudah disesuaikan tanpa mengubah markup.
  const activitiesBgMobile = {
    x: '-34%',
    y: '-10px',
    width: '180%',
    height: '720px',
    scaleX: 1,
    scaleY: 1,
    wrapperHeight: 'h-[700px]',
    visibility: 'block sm:hidden',
  };

  // Konfigurasi dekorasi background untuk viewport tablet.
  const activitiesBgTablet = {
    x: '-26%',
    y: '-158px',
    width: '165%',
    height: '900px',
    scaleX: 1.06,
    scaleY: 1,
    wrapperHeight: 'hidden sm:block lg:hidden h-[860px]',
    visibility: '',
  };

  // Konfigurasi dekorasi background untuk viewport desktop.
  const activitiesBgDesktop = {
    x: '-22%',
    y: '-100px',
    width: '158%',
    height: '1200px',
    scaleX: 1.15,
    scaleY: 1,
    wrapperHeight: 'hidden lg:block h-[1100px]',
    visibility: '',
  };

  // Helper untuk merender ornamen background Activities berdasarkan konfigurasi responsive.
  const renderActivitiesBg = (config) => (
    <div
      className={`pointer-events-none absolute inset-x-0 top-0 z-0 overflow-visible ${config.wrapperHeight} ${config.visibility}`}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: config.width,
          height: config.height,
          transform: `translate(${config.x}, ${config.y})`,
        }}
      >
        <Image
          src="/decor/activities1.svg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-contain"
          style={{
            transform: `scale(${config.scaleX}, ${config.scaleY})`,
            transformOrigin: 'top left',
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="relative z-10">
      {/* Section hero utama halaman Activities. */}
      {isSectionVisible(data, 'hero') && <ActivitiesHero data={data.hero} />}

      {/* Wrapper untuk section Programs dan Events beserta dekorasi background-nya. */}
      <div className="relative overflow-visible">
        {renderActivitiesBg(activitiesBgMobile)}
        {renderActivitiesBg(activitiesBgTablet)}
        {renderActivitiesBg(activitiesBgDesktop)}

        {/* Section daftar program/kegiatan yang bisa dibuka detailnya. */}
        {isSectionVisible(data, 'programs') && <ProgramsSection data={data.programs} />}

        {/* Section daftar event dengan carousel dan kartu flip. */}
        {isSectionVisible(data, 'events') && <EventsSection data={data.events} />}
      </div>
    </div>
  );
}
