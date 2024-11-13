// src/components/MoodAnalytics.tsx
'use client';

import { Card } from '@/components/ui/card';

interface MoodAnalyticsProps {
  moods: {
    mood: number;
    createdAt: Date;
  }[];
}

const moodEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😄',
};

interface MoodAnalytics {
  mostFrequentMood: number;
  bestDayOfWeek: string;
  worstDayOfWeek: string;
  totalEntries: number;
}

function analyzeMoods(
  moods: { mood: number; createdAt: Date }[]
): MoodAnalytics {
  if (!moods.length) {
    return {
      mostFrequentMood: 0,
      bestDayOfWeek: 'N/A',
      worstDayOfWeek: 'N/A',
      totalEntries: 0,
    };
  }

  // Calculate most frequent mood
  const moodFrequency: Record<number, number> = {};
  moods.forEach(({ mood }) => {
    moodFrequency[mood] = (moodFrequency[mood] || 0) + 1;
  });
  const mostFrequentMood = Number(
    Object.entries(moodFrequency).reduce((a, b) =>
      moodFrequency[Number(a[0])] > moodFrequency[Number(b[0])] ? a : b
    )[0]
  );

  // Calculate average mood by day of week
  const dayAverages: Record<string, number[]> = {};
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  moods.forEach(({ mood, createdAt }) => {
    const day = days[new Date(createdAt).getDay()];
    if (!dayAverages[day]) dayAverages[day] = [];
    dayAverages[day].push(mood);
  });

  const dayAveragesCalculated = Object.entries(dayAverages).map(
    ([day, moods]) => ({
      day,
      average: moods.reduce((a, b) => a + b, 0) / moods.length,
    })
  );

  const bestDayOfWeek = dayAveragesCalculated.reduce((a, b) =>
    a.average > b.average ? a : b
  ).day;

  const worstDayOfWeek = dayAveragesCalculated.reduce((a, b) =>
    a.average < b.average ? a : b
  ).day;

  return {
    mostFrequentMood,
    bestDayOfWeek,
    worstDayOfWeek,
    totalEntries: moods.length,
  };
}

export function MoodAnalytics({ moods }: MoodAnalyticsProps) {
  const analytics = analyzeMoods(moods);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Mood Insights</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Most Frequent Mood</p>
          <p className="text-lg font-medium">
            {moodEmojis[analytics.mostFrequentMood]}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Entries</p>
          <p className="text-lg font-medium">{analytics.totalEntries}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Best Day</p>
          <p className="text-lg font-medium">{analytics.bestDayOfWeek}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Challenging Day</p>
          <p className="text-lg font-medium">{analytics.worstDayOfWeek}</p>
        </div>
      </div>
    </Card>
  );
}
