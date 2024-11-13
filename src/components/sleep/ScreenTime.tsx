// components/ScreenTimeForm.tsx
'use client';

import { createScreenTimeRecord } from '@/action/sleep';
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
import { Monitor } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'work', label: 'Work' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'social', label: 'Social Media' },
  { value: 'other', label: 'Other' },
] as const;

type Category = (typeof CATEGORIES)[number]['value'];

export function ScreenTimeForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [minutes, setMinutes] = useState('');
  const [category, setCategory] = useState<Category>(CATEGORIES[0].value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !minutes) {
      toast.error('Please fill in all fields');
      return;
    }

    const minutesNum = parseInt(minutes);
    if (isNaN(minutesNum) || minutesNum < 0 || minutesNum > 1440) {
      toast.error('Please enter a valid number of minutes (0-1440)');
      return;
    }

    setLoading(true);

    try {
      const result = await createScreenTimeRecord({
        date: date,
        minutes: minutesNum,
        category: category,
      });

      if (result.success) {
        toast.success('Screen time recorded successfully');
        onSubmitSuccess();
        // Reset form
        setDate(undefined);
        setMinutes('');
        setCategory(CATEGORIES[0].value);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to record screen time'
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-purple-500" />
          <CardTitle>Track Screen Time</CardTitle>
        </div>
        <CardDescription>
          Record your daily screen time by category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="date" className="text-sm font-medium">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant="outline"
                    className={cn(
                      'justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <Monitor className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date > new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="minutes" className="text-sm font-medium">
                  Minutes
                </label>
                <Input
                  id="minutes"
                  type="number"
                  value={minutes}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (
                      !value ||
                      (parseInt(value) >= 0 && parseInt(value) <= 1440)
                    ) {
                      setMinutes(value);
                    }
                  }}
                  min="0"
                  max="1440"
                  placeholder="Enter minutes"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Max 24 hours (1440 minutes)
                </p>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select
                  value={category}
                  onValueChange={(value: Category) => setCategory(value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !date || !minutes}
          >
            {loading ? 'Saving...' : 'Save Screen Time'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
