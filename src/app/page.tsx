import { getMoods } from '@/action/mood-action';
import { MoodAnalytics } from '@/components/mood-analytics';
import MoodCalendar from '@/components/mood-calendar';
import { MoodForm } from '@/components/mood-form';
import MoodStats from '@/components/mood-stats';
import { Toaster } from '@/components/ui/toaster';

export default async function Home() {
  const moods = await getMoods();

  return (
    <main className="container mx-auto py-8 space-y-8">
      <h1 className="text-4xl font-bold">Mood Tracker</h1>
      <MoodStats moods={moods} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className=" space-y-4">
          <h2 className="text-2xl font-semibold">Log Your Mood</h2>
          <MoodForm />
          <MoodAnalytics moods={moods} />
        </div>
        <MoodCalendar moods={moods} />
      </div>
      <Toaster />
    </main>
  );
}
