import { getContent } from '@/lib/content';
import ActivitiesHero from '@/components/activities/ActivitiesHero';
import ProgramsSection from '@/components/activities/ProgramsSection';
import EventsSection from '@/components/activities/EventsSection';

export const metadata = {
  title: 'Activities — Artha Mitra Interdata',
  description: 'Our latest events, programs, and activities.',
};

export default function ActivitiesPage() {
  const data = getContent('activities');

  return (
    <>
      <ActivitiesHero data={data.hero} />
      <ProgramsSection data={data.programs} />
      <EventsSection data={data.events} />
    </>
  );
}
