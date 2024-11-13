// app/page.tsx

import SleepTracker from '@/components/sleep/SleepTracker';

export default function HomePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold">Sleep Tracker</h1>

      <SleepTracker />
    </div>
  );
}
