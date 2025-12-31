export type BillingCycle = "monthly" | "yearly";
export type ReminderDays = 1 | 3 | 7;

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  startDate: string;
  reminderDays: ReminderDays;
  nextRenewalDate: string;
}
