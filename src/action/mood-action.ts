// src/actions/mood-actions.ts
'use server';

import { db } from '@/db/db';
import { moods } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function addMood(mood: number, note?: string) {
  try {
    await db.insert(moods).values({
      mood,
      note,
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export async function getMoods() {
  try {
    const result = await db.select().from(moods).orderBy(moods.createdAt);
    return result;
  } catch (error) {
    console.error('Error fetching moods:', error);
    return [];
  }
}
