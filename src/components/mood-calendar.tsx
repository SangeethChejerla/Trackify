'use client';

import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface MoodCalendarProps {
  moods: {
    mood: number;
    note?: string;
    createdAt: Date;
  }[];
}

const moodColors = {
  1: 'bg-red-200 hover:bg-red-300',
  2: 'bg-orange-200 hover:bg-orange-300',
  3: 'bg-yellow-200 hover:bg-yellow-300',
  4: 'bg-green-200 hover:bg-green-300',
  5: 'bg-emerald-200 hover:bg-emerald-300',
};

const moodEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😄',
};

export default function MoodCalendar({ moods }: MoodCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCurrentDate(
                  new Date(currentDate.setMonth(currentDate.getMonth() - 1))
                );
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setCurrentDate(
                  new Date(currentDate.setMonth(currentDate.getMonth() + 1))
                );
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium p-2">
              {day}
            </div>
          ))}

          {days.map((day) => {
            const mood = moods.find((m) =>
              isSameDay(new Date(m.createdAt), day)
            );

            return (
              <TooltipProvider key={day.toString()}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={`
                        aspect-square p-2 rounded-lg flex items-center justify-center
                        ${mood ? moodColors[mood.mood] : 'bg-gray-100'}
                        transition-colors
                      `}
                    >
                      <div className="text-sm">
                        <div>{format(day, 'd')}</div>
                        {mood && (
                          <div className="text-lg">{moodEmojis[mood.mood]}</div>
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  {mood && (
                    <TooltipContent>
                      <div className="space-y-1">
                        <p>Mood: {moodEmojis[mood.mood]}</p>
                        {mood.note && <p className="text-sm">{mood.note}</p>}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
