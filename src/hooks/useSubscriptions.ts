import { useState, useEffect, useCallback, useMemo } from "react";
import type { Subscription } from "@/types/subscription";
import {
  loadSubscriptions,
  saveSubscriptions,
  generateId,
  calculateNextRenewalDate,
  getMonthlyAmount,
  getDaysUntilRenewal,
} from "@/lib/subscriptions";

export const useSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadSubscriptions();
    setSubscriptions(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveSubscriptions(subscriptions);
    }
  }, [subscriptions, isLoaded]);

  const addSubscription = useCallback((data: Omit<Subscription, "id" | "nextRenewalDate">) => {
    const newSubscription: Subscription = {
      ...data,
      id: generateId(),
      nextRenewalDate: calculateNextRenewalDate(data.startDate, data.billingCycle),
    };
    setSubscriptions((prev) => [...prev, newSubscription]);
  }, []);

  const updateSubscription = useCallback((id: string, data: Omit<Subscription, "id" | "nextRenewalDate">) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id
          ? {
              ...sub,
              ...data,
              nextRenewalDate: calculateNextRenewalDate(data.startDate, data.billingCycle),
            }
          : sub
      )
    );
  }, []);

  const deleteSubscription = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  }, []);

  const totalMonthly = useMemo(() => {
    return subscriptions.reduce((total, sub) => {
      return total + getMonthlyAmount(sub.amount, sub.billingCycle);
    }, 0);
  }, [subscriptions]);

  const upcomingRenewals = useMemo(() => {
    return subscriptions
      .filter((sub) => getDaysUntilRenewal(sub.nextRenewalDate) <= 7)
      .sort((a, b) => getDaysUntilRenewal(a.nextRenewalDate) - getDaysUntilRenewal(b.nextRenewalDate));
  }, [subscriptions]);

  const nextRenewal = useMemo(() => {
    if (subscriptions.length === 0) return null;
    return subscriptions.reduce((nearest, sub) => {
      if (!nearest) return sub;
      return getDaysUntilRenewal(sub.nextRenewalDate) < getDaysUntilRenewal(nearest.nextRenewalDate)
        ? sub
        : nearest;
    }, null as Subscription | null);
  }, [subscriptions]);

  return {
    subscriptions,
    isLoaded,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    totalMonthly,
    upcomingRenewals,
    nextRenewal,
  };
};
