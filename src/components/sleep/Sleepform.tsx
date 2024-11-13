// components/SleepForm.tsx
'use client';

import { createSleepRecord } from '@/action/sleep';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SleepForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [sleepTime, setSleepTime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState('3');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !sleepTime || !wakeTime) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const sleepDateTime = new Date(
        `${format(date, 'yyyy-MM-dd')}T${sleepTime}`
      );
      const wakeDateTime = new Date(
        `${format(date, 'yyyy-MM-dd')}T${wakeTime}`
      );

      if (wakeDateTime <= sleepDateTime) {
        wakeDateTime.setDate(wakeDateTime.getDate() + 1);
      }

      const result = await createSleepRecord({
        date: date,
        sleepTime: sleepDateTime,
        wakeTime: wakeDateTime,
        quality: parseInt(quality),
      });

      if (result.success) {
        toast.success('Sleep record added successfully');
        onSubmitSuccess();
        // Reset form
        setDate(undefined);
        setSleepTime('');
        setWakeTime('');
        setQuality('3');
      } else {
        toast.error(result.error || 'Failed to add sleep record');
      }
    } catch (error) {
      toast.error('Failed to add sleep record');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Moon className="w-5 h-5 text-blue-500" />
          <CardTitle>Track Your Sleep</CardTitle>
        </div>
        <CardDescription>
          Record your sleep schedule and quality
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rest of the form JSX remains the same */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sleep Time</label>
                <div className="relative">
                  <Input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Moon className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Wake Time</label>
                <div className="relative">
                  <Input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <Sun className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Sleep Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: '1', label: 'Poor' },
                    { value: '2', label: 'Fair' },
                    { value: '3', label: 'Good' },
                    { value: '4', label: 'Very Good' },
                    { value: '5', label: 'Excellent' },
                  ].map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value} - {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Sleep Record'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
