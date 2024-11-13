// app/actions/food-actions.ts
'use server';

import { db } from '@/db/db';
import { foodIntakeTable } from '@/db/schema';
import { FoodIntake } from '@/types/food';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function updateFoodIntake(
  date: Date,
  data: Partial<Omit<FoodIntake, 'id' | 'date' | 'createdAt' | 'updatedAt'>>
) {
  try {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    // First try to find existing record
    const existing = await db
      .select()
      .from(foodIntakeTable)
      .where(eq(foodIntakeTable.date, dateObj));

    if (existing.length === 0) {
      // Create new record
      await db.insert(foodIntakeTable).values({
        date: dateObj,
        ...data,
      });
    } else {
      // Update existing record
      await db
        .update(foodIntakeTable)
        .set({
          ...data,
          updatedAt: sql`CURRENT_TIMESTAMP`,
        })
        .where(eq(foodIntakeTable.date, dateObj));
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Error updating food intake:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}
