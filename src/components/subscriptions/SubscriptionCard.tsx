import { format, parseISO } from "date-fns";
import { Pencil, Trash2, Calendar, RefreshCw } from "lucide-react";
import type { Subscription } from "@/types/subscription";
import { formatCurrency, getDaysUntilRenewal, getMonthlyAmount } from "@/lib/subscriptions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  index: number;
}

export const SubscriptionCard = ({ subscription, onEdit, onDelete, index }: SubscriptionCardProps) => {
  const daysUntil = getDaysUntilRenewal(subscription.nextRenewalDate);
  const monthlyAmount = getMonthlyAmount(subscription.amount, subscription.billingCycle);

  return (
    <div 
      className="bg-card rounded-lg p-5 shadow-card hover:shadow-card-hover transition-shadow animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{subscription.name}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" />
              {subscription.billingCycle === "monthly" ? "Monthly" : "Yearly"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {format(parseISO(subscription.nextRenewalDate), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-foreground">{formatCurrency(subscription.amount)}</p>
          {subscription.billingCycle === "yearly" && (
            <p className="text-xs text-muted-foreground">
              {formatCurrency(monthlyAmount)}/mo
            </p>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          daysUntil <= 3 ? "bg-warning/10 text-warning" : "bg-secondary text-secondary-foreground"
        )}>
          {daysUntil === 0 ? "Renews today" : daysUntil === 1 ? "Renews tomorrow" : `Renews in ${daysUntil} days`}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(subscription)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="w-4 h-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(subscription.id)}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
