// src/components/MoodForm.tsx
'use client';

import { addMood } from '@/action/mood-action';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';

const moodEmojis = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😄',
};

export function MoodForm() {
  const [mood, setMood] = useState<number>(3);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await addMood(mood, note);
      if (result.success) {
        toast({
          title: 'Mood saved!',
          description: 'Your mood has been successfully recorded.',
        });
        setNote('');
      } else {
        throw new Error('Failed to save mood');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save your mood. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">How are you feeling?</label>
          <div className="flex gap-2">
            {Object.entries(moodEmojis).map(([value, emoji]) => (
              <Button
                key={value}
                type="button"
                variant={mood === Number(value) ? 'default' : 'outline'}
                onClick={() => setMood(Number(value))}
                className="text-2xl h-12 w-12"
              >
                {emoji}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes (optional)</label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add any notes about your mood..."
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Mood'}
        </Button>
      </form>
    </Card>
  );
}
