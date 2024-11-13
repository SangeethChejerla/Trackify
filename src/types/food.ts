export interface FoodIntake {
  id: string;
  date: Date;
  breakfast: boolean;
  lunch: boolean;
  snacks: boolean;
  dinner: boolean;
  waterIntake: number; // 0-4 representing empty to full
  createdAt: Date;
  updatedAt: Date;
}
