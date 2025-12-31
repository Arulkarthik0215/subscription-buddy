export type BillingCycle = "monthly" | "yearly";
export type ReminderDays = 1 | 3 | 7;

export type Category = 
  | "entertainment"
  | "productivity"
  | "utilities"
  | "shopping"
  | "health"
  | "education"
  | "other";

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "entertainment", label: "Entertainment" },
  { value: "productivity", label: "Productivity" },
  { value: "utilities", label: "Utilities" },
  { value: "shopping", label: "Shopping" },
  { value: "health", label: "Health & Fitness" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  startDate: string;
  reminderDays: ReminderDays;
  nextRenewalDate: string;
  category: Category;
}
