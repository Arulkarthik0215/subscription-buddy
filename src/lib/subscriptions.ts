import { addMonths, addYears, parseISO, isBefore, startOfToday, format } from "date-fns";
import type { Subscription, BillingCycle } from "@/types/subscription";

const STORAGE_KEY = "subtrack_subscriptions";

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const calculateNextRenewalDate = (startDate: string, billingCycle: BillingCycle): string => {
  const start = parseISO(startDate);
  const today = startOfToday();
  let nextDate = start;

  while (isBefore(nextDate, today)) {
    nextDate = billingCycle === "monthly" 
      ? addMonths(nextDate, 1) 
      : addYears(nextDate, 1);
  }

  return format(nextDate, "yyyy-MM-dd");
};

export const getMonthlyAmount = (amount: number, billingCycle: BillingCycle): number => {
  return billingCycle === "yearly" ? amount / 12 : amount;
};

export const loadSubscriptions = (): Subscription[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading subscriptions:", error);
  }
  return [];
};

export const saveSubscriptions = (subscriptions: Subscription[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  } catch (error) {
    console.error("Error saving subscriptions:", error);
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const getDaysUntilRenewal = (renewalDate: string): number => {
  const today = startOfToday();
  const renewal = parseISO(renewalDate);
  const diffTime = renewal.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
