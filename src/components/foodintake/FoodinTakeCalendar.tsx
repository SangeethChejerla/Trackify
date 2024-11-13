'use client';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  startOfMonth,
} from 'date-fns';
import { GlassWater } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface FoodIntake {
  date: string;
  breakfast?: boolean;
  lunch?: boolean;
  snacks?: boolean;
  dinner?: boolean;
  waterIntake?: number;
}

interface FoodIntakeCalendarProps {
  intakes: FoodIntake[];
  onUpdate: (date: Date, data: Partial<FoodIntake>) => Promise<any>;
}

const getCompletionColor = (intake: FoodIntake) => {
  const meals = ['breakfast', 'lunch', 'snacks', 'dinner'].filter(
    (key) => intake[key as keyof FoodIntake]
  );
  const completion = meals.length / 4;
  if (completion === 1) return 'bg-green-200';
  if (completion > 0.5) return 'bg-yellow-200';
  return 'bg-red-200';
};

const WaterIntake = ({ level }: { level: number }) => (
  <div className="flex items-center justify-center">
    <GlassWater className="h-4 w-4 mr-1" />
    <span className="text-xs">{level}</span>
  </div>
);

function FoodIntakeDialog({
  isOpen,
  onClose,
  selectedDate,
  intake,
  onUpdate,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  intake?: FoodIntake;
  onUpdate: (date: Date, data: Partial<FoodIntake>) => Promise<any>;
}) {
  const [formData, setFormData] = useState<Partial<FoodIntake>>({
    breakfast: intake?.breakfast || false,
    lunch: intake?.lunch || false,
    snacks: intake?.snacks || false,
    dinner: intake?.dinner || false,
    waterIntake: intake?.waterIntake || 0,
  });

  const handleSubmit = async () => {
    try {
      await onUpdate(selectedDate, formData);
      onClose();
    } catch (error) {
      console.error('Error updating intake:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-[425px]"
        onEscapeKeyDown={onClose}
        onInteractOutside={onClose}
      >
        <DialogHeader>
          <DialogTitle>
            Food Intake for {format(selectedDate, 'MMMM d, yyyy')}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meals</label>
              <div className="space-y-3">
                {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal) => (
                  <div key={meal} className="flex items-center space-x-2">
                    <Checkbox
                      id={meal}
                      checked={
                        formData[meal as keyof typeof formData] as boolean
                      }
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, [meal]: checked }))
                      }
                    />
                    <label
                      htmlFor={meal}
                      className="text-sm font-medium leading-none"
                    >
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Water Intake</label>
              <div className="flex items-center justify-center space-x-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Button
                    key={index}
                    variant={
                      formData.waterIntake! > index ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        waterIntake: index + 1,
                      }))
                    }
                    className="h-8 w-8 p-0"
                  >
                    <GlassWater className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FoodIntakeCalendar({
  intakes,
  onUpdate,
}: FoodIntakeCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const today = new Date();

  const handlePrevMonth = () => {
    const prevMonthDate = new Date(currentDate);
    prevMonthDate.setMonth(prevMonthDate.getMonth() - 1);
    prevMonthDate.setDate(1);
    setCurrentDate(prevMonthDate);
  };

  const handleNextMonth = () => {
    const nextMonthDate = new Date(currentDate);
    nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
    nextMonthDate.setDate(1);
    setCurrentDate(nextMonthDate);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}>
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const intake = intakes.find((i) => isSameDay(new Date(i.date), day));
          const isToday = isSameDay(day, today);

          return (
            <div
              key={day.toString()}
              className={`
                aspect-square p-2 rounded-lg flex flex-col items-center justify-center
                ${intake ? getCompletionColor(intake) : 'bg-gray-100'}
                ${isToday ? 'ring-2 ring-primary' : ''}
                transition-colors cursor-pointer hover:bg-gray-200
              `}
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-sm font-medium">{format(day, 'd')}</div>
              {intake?.waterIntake > 0 && (
                <WaterIntake level={intake.waterIntake} />
              )}
              <div className="flex flex-wrap justify-center">
                {['breakfast', 'lunch', 'snacks', 'dinner'].map((meal) => (
                  <Checkbox
                    key={meal}
                    checked={intake?.[meal as keyof FoodIntake] || false}
                    disabled
                    className="m-1"
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <FoodIntakeDialog
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          selectedDate={selectedDate}
          intake={intakes.find(
            (i) => selectedDate && isSameDay(new Date(i.date), selectedDate)
          )}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}
