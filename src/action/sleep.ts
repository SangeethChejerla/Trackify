'use server';

import { db } from '@/db/db';
import { screenTimeRecords, sleepRecords } from '@/db/schema'; // Your schema
import { sql } from 'drizzle-orm';

type SleepRecord = {
  date: Date;
  sleepTime: Date;
  wakeTime: Date;
  quality: number;
};
type ScreenTimeRecord = {
  date: Date;
  minutes: number;
  category: string;
};

// Sleep record actions
export async function createSleepRecord(data: SleepRecord) {
  try {
    // Calculate total sleep in minutes
    const totalSleepMinutes = Math.floor(
      (data.wakeTime.getTime() - data.sleepTime.getTime()) / (1000 * 60)
    );

    const record = await db
      .insert(sleepRecords)
      .values({
        date: data.date ? data.date.toISOString().split('T')[0] : null,
        sleepTime: data.sleepTime,
        wakeTime: data.wakeTime,
        totalSleep: totalSleepMinutes,
        quality: data.quality,
      })
      .returning();

    return { success: true, data: record[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create sleep record' };
  }
}

export async function getSleepRecords(startDate: Date, endDate: Date) {
  try {
    const records = await db
      .select()
      .from(sleepRecords)
      .where(sql`${sleepRecords.date} BETWEEN ${startDate} AND ${endDate}`)
      .orderBy(sleepRecords.date);

    return { success: true, data: records };
  } catch (error) {
    return { success: false, error: 'Failed to fetch sleep records' };
  }
}

// Screen time record actions
export async function createScreenTimeRecord(data: ScreenTimeRecord) {
  try {
    const record = await db
      .insert(screenTimeRecords)
      .values({
        date: data.date.toISOString().split('T')[0], // Convert Date to string in YYYY-MM-DD format
        minutes: data.minutes,
        category: data.category,
      })
      .returning();

    return { success: true, data: record[0] };
  } catch (error) {
    return { success: false, error: 'Failed to create screen time record' };
  }
}

export async function getScreenTimeRecords(startDate: Date, endDate: Date) {
  try {
    const records = await db
      .select()
      .from(screenTimeRecords)
      .where(sql`${screenTimeRecords.date} BETWEEN ${startDate} AND ${endDate}`)
      .orderBy(screenTimeRecords.date);

    return { success: true, data: records };
  } catch (error) {
    return { success: false, error: 'Failed to fetch screen time records' };
  }
}
