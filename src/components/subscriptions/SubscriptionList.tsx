import { CreditCard } from "lucide-react";
import type { Subscription } from "@/types/subscription";
import { SubscriptionCard } from "./SubscriptionCard";

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionList = ({ subscriptions, onEdit, onDelete }: SubscriptionListProps) => {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 shadow-card text-center animate-fade-in">
        <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No subscriptions added yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Start tracking your subscriptions by clicking the "Add Subscription" button above.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map((subscription, index) => (
        <SubscriptionCard
          key={subscription.id}
          subscription={subscription}
          onEdit={onEdit}
          onDelete={onDelete}
          index={index}
        />
      ))}
    </div>
  );
};
