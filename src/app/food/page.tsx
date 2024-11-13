// app/dashboard/page.tsx
import { updateFoodIntake } from '@/action/food-action';
import FoodIntakeCalendar from '@/components/foodintake/FoodinTakeCalendar';
import { Toaster } from '@/components/ui/toaster';
import { db } from '@/db/db';
import { foodIntakeTable } from '@/db/schema';

export default async function DashboardPage() {
  const intakes = await db
    .select()
    .from(foodIntakeTable)
    .orderBy(foodIntakeTable.date);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Food & Water Intake Tracker</h1>
      <FoodIntakeCalendar intakes={intakes} onUpdate={updateFoodIntake} />
      <Toaster />
    </div>
  );
}
