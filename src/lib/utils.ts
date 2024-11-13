import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateStreaks(moods: { mood: number; createdAt: Date }[]) {
  if (!moods.length) return { currentStreak: 0, bestStreak: 0 };

  // Sort moods by date
  const sortedMoods = [...moods].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  let currentStreak = 0;
  let bestStreak = 0;
  let currentDate = new Date();

  // Calculate current streak
  for (let i = 0; i < sortedMoods.length; i++) {
    const moodDate = new Date(sortedMoods[i].createdAt);
    const dayDifference = Math.floor(
      (currentDate.getTime() - moodDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDifference === currentStreak) {
      currentStreak++;
      currentDate = moodDate;
    } else {
      break;
    }
  }

  // Calculate best streak
  let tempStreak = 1;
  for (let i = 1; i < sortedMoods.length; i++) {
    const prevDate = new Date(sortedMoods[i - 1].createdAt);
    const currDate = new Date(sortedMoods[i].createdAt);
    const dayDifference = Math.floor(
      (prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (dayDifference === 1) {
      tempStreak++;
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, bestStreak };
}

export function calculateAverageMood(
  moods: { mood: number; createdAt: Date }[]
) {
  if (!moods.length) return 0;

  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const recentMoods = moods.filter(
    (mood) => new Date(mood.createdAt) >= last30Days
  );

  if (!recentMoods.length) return 0;

  return Number(
    (
      recentMoods.reduce((sum, mood) => sum + mood.mood, 0) / recentMoods.length
    ).toFixed(1)
  );
}
