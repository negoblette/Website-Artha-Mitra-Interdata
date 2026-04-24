import { getContent } from '@/lib/content';
import ActivitiesHero from '@/components/activities/ActivitiesHero';
import ProgramsSection from '@/components/activities/ProgramsSection';
import EventsSection from '@/components/activities/EventsSection';

export const metadata = {
  title: 'Activities - Artha Mitra Interdata',
  description: 'Our latest events, programs, and activities.',
};

export default function ActivitiesPage() {
  const data = getContent('activities');

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundImage: "url('/images/reference/Activities-page-background.svg')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'top -100px center',
      }}
    >
      <div className="relative z-10">
        <ActivitiesHero data={data.hero} />
        <ProgramsSection data={data.programs} />
        <EventsSection data={data.events} />
      </div>
    </div>
  );
}