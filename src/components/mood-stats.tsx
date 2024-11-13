// src/components/MoodStats.tsx
'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { calculateAverageMood, calculateStreaks } from '@/lib/utils';
import { Activity, Award, Flame } from 'lucide-react';
import { StatCard } from './statcard';

interface MoodStatsProps {
  moods: {
    mood: number;
    createdAt: Date;
  }[];
}

export default function MoodStats({ moods }: MoodStatsProps) {
  const { currentStreak, bestStreak } = calculateStreaks(moods);
  const averageMood = calculateAverageMood(moods);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Average Mood"
                value={averageMood.toString()}
                icon={<Activity className="h-4 w-4" />}
                description="Based on the last 30 days"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your average mood over the last 30 days</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Best Streak"
                value={`${bestStreak} days`}
                icon={<Award className="h-4 w-4" />}
                description="Longest consecutive entries"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your longest streak of daily mood entries</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <StatCard
                title="Current Streak"
                value={`${currentStreak} days`}
                icon={<Flame className="h-4 w-4" />}
                description="Current consecutive entries"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your current streak of daily mood entries</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
