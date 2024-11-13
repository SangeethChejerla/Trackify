'use client';

import { getScreenTimeRecords, getSleepRecords } from '@/action/sleep';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { subDays } from 'date-fns';
import { Monitor, Moon, Sun, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

// Define interfaces for your data structures
interface SleepRecord {
  totalSleep: number;
  quality: number;
  date: string;
}

interface ScreenTimeRecord {
  minutes: number;
  date: string;
}

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

interface Stats {
  averageSleep: number;
  sleepQuality: number;
  averageScreenTime: number;
  peakScreenTime: string;
  trends: {
    sleep: number;
    quality: number;
  };
}

function StatsCard({ title, value, description, icon, trend }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div
            className={`mt-2 flex items-center text-xs ${
              trend.value >= 0 ? 'text-green-500' : 'text-red-500'
            }`}
          >
            <Zap className="mr-1 h-4 w-4" />
            {Math.abs(trend.value)}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function LoadingStatsCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}

export function StatsCards() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    averageSleep: 0,
    sleepQuality: 0,
    averageScreenTime: 0,
    peakScreenTime: '',
    trends: {
      sleep: 0,
      quality: 0,
    },
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const endDate = new Date();
        const thirtyDaysAgo = subDays(endDate, 30);
        const sixtyDaysAgo = subDays(endDate, 60);

        const [currentSleepResult, currentScreenResult, prevSleepResult] =
          await Promise.all([
            getSleepRecords(thirtyDaysAgo, endDate),
            getScreenTimeRecords(thirtyDaysAgo, endDate),
            getSleepRecords(sixtyDaysAgo, thirtyDaysAgo),
          ]);

        if (
          !currentSleepResult.success ||
          !currentScreenResult.success ||
          !prevSleepResult.success
        ) {
          throw new Error('Failed to fetch data');
        }

        const currentSleepData: SleepRecord[] = currentSleepResult.data || [];
        const currentScreenData: ScreenTimeRecord[] =
          currentScreenResult.data || [];
        const prevSleepData: SleepRecord[] = prevSleepResult.data || [];

        // Calculate averages for current month
        const averageSleep =
          currentSleepData.length > 0
            ? currentSleepData.reduce((acc, curr) => acc + curr.totalSleep, 0) /
              currentSleepData.length /
              60
            : 0;

        const averageQuality =
          currentSleepData.length > 0
            ? currentSleepData.reduce((acc, curr) => acc + curr.quality, 0) /
              currentSleepData.length
            : 0;

        const averageScreenTime =
          currentScreenData.length > 0
            ? currentScreenData.reduce((acc, curr) => acc + curr.minutes, 0) /
              currentScreenData.length /
              60
            : 0;

        // Calculate averages for previous month
        const prevAverageSleep =
          prevSleepData.length > 0
            ? prevSleepData.reduce((acc, curr) => acc + curr.totalSleep, 0) /
              prevSleepData.length /
              60
            : 0;

        const prevAverageQuality =
          prevSleepData.length > 0
            ? prevSleepData.reduce((acc, curr) => acc + curr.quality, 0) /
              prevSleepData.length
            : 0;

        // Calculate trends
        const sleepTrend =
          prevAverageSleep > 0
            ? Math.round(
                ((averageSleep - prevAverageSleep) / prevAverageSleep) * 100
              )
            : 0;

        const qualityTrend =
          prevAverageQuality > 0
            ? Math.round(
                ((averageQuality - prevAverageQuality) / prevAverageQuality) *
                  100
              )
            : 0;

        // Calculate peak screen time
        const screenTimesByHour = new Map<number, number>();
        currentScreenData.forEach((record) => {
          const hour = new Date(record.date).getHours();
          screenTimesByHour.set(
            hour,
            (screenTimesByHour.get(hour) || 0) + record.minutes
          );
        });

        const peakHourEntry = Array.from(screenTimesByHour.entries()).sort(
          ([, a], [, b]) => b - a
        )[0];
        const peakHour = peakHourEntry ? peakHourEntry[0] : 0;

        const formatHour = (hour: number): string => {
          const ampm = hour >= 12 ? 'pm' : 'am';
          const formattedHour = hour % 12 || 12;
          return `${formattedHour}${ampm}`;
        };

        setStats({
          averageSleep,
          sleepQuality: averageQuality,
          averageScreenTime,
          peakScreenTime: `${formatHour(peakHour)}-${formatHour(
            (peakHour + 1) % 24
          )}`,
          trends: {
            sleep: sleepTrend,
            quality: qualityTrend,
          },
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(
          error instanceof Error ? error.message : 'Failed to fetch stats'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
        {[...Array(4)].map((_, i) => (
          <LoadingStatsCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 text-red-500 rounded-lg">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-8">
      <StatsCard
        title="Average Sleep"
        value={`${stats.averageSleep.toFixed(1)}hrs`}
        description="Past 30 days"
        icon={<Moon className="h-4 w-4 text-blue-500" />}
        trend={{
          value: stats.trends.sleep,
          label:
            stats.trends.sleep >= 0
              ? 'increase from last month'
              : 'decrease from last month',
        }}
      />
      <StatsCard
        title="Sleep Quality"
        value={`${stats.sleepQuality.toFixed(1)}/5`}
        description="Average rating"
        icon={<Sun className="h-4 w-4 text-yellow-500" />}
        trend={{
          value: stats.trends.quality,
          label: stats.trends.quality >= 0 ? 'improvement' : 'decrease',
        }}
      />
      <StatsCard
        title="Screen Time"
        value={`${stats.averageScreenTime.toFixed(1)}hrs`}
        description="Daily average"
        icon={<Monitor className="h-4 w-4 text-purple-500" />}
      />
      <StatsCard
        title="Most Active"
        value={stats.peakScreenTime}
        description="Peak screen time"
        icon={<Zap className="h-4 w-4 text-orange-500" />}
      />
    </div>
  );
}
