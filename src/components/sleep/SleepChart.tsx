'use client';

import { getScreenTimeRecords, getSleepRecords } from '@/action/sleep';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO, subDays } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border">
        <p className="font-medium">{format(parseISO(label), 'MMM dd, yyyy')}</p>
        {payload.map((entry: any) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm">
              {entry.name}: {entry.value.toFixed(1)} hrs
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function SleepChart() {
  const [timeRange, setTimeRange] = useState('30');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const endDate = new Date();
      const startDate = subDays(endDate, parseInt(timeRange));

      const [sleepResult, screenResult] = await Promise.all([
        getSleepRecords(startDate, endDate),
        getScreenTimeRecords(startDate, endDate),
      ]);

      if (!sleepResult.success || !screenResult.success) {
        throw new Error(
          sleepResult.error || screenResult.error || 'Data fetch failed'
        );
      }

      const processedData = sleepResult.data.map((sleep) => {
        const screenForDay = screenResult.data.find(
          (screen) =>
            format(new Date(screen.date), 'yyyy-MM-dd') ===
            format(new Date(sleep.date), 'yyyy-MM-dd')
        );

        return {
          date: format(new Date(sleep.date), 'yyyy-MM-dd'),
          sleep: Math.round((sleep.totalSleep / 60) * 10) / 10,
          screen: screenForDay
            ? Math.round((screenForDay.minutes / 60) * 10) / 10
            : 0,
        };
      });

      setData(processedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  if (loading) return <Skeleton className="w-full h-[400px]" />;

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex justify-between pb-2">
        <div>
          <CardTitle>Sleep & Screen Time Analysis</CardTitle>
          <CardDescription>Track your patterns over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="sleep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(parseISO(value), 'MMM dd')}
                stroke="#6b7280"
              />
              <YAxis stroke="#6b7280" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="sleep"
                stroke="#0ea5e9"
                fillOpacity={1}
                fill="url(#sleep)"
                name="Sleep Duration"
              />
              <Area
                type="monotone"
                dataKey="screen"
                stroke="#f43f5e"
                fillOpacity={1}
                fill="url(#screen)"
                name="Screen Time"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
