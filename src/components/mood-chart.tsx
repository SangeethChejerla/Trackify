// src/components/MoodChart.tsx
'use client';

import { Card } from '@/components/ui/card';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface MoodChartProps {
  moods: {
    mood: number;
    createdAt: Date;
  }[];
}

export default function MoodChart({ moods }: MoodChartProps) {
  const data = moods.map((mood) => ({
    date: new Date(mood.createdAt).toLocaleDateString(),
    mood: mood.mood,
  }));

  return (
    <Card className="p-4">
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="date" />
            <YAxis domain={[1, 5]} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="mood"
              stroke="#8884d8"
              fill="#8884d8"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
