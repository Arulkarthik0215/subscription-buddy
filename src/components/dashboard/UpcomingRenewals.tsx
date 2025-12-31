import { format, parseISO } from "date-fns";
import { CalendarClock, AlertCircle } from "lucide-react";
import type { Subscription } from "@/types/subscription";
import { formatCurrency, getDaysUntilRenewal } from "@/lib/subscriptions";
import { cn } from "@/lib/utils";

interface UpcomingRenewalsProps {
  renewals: Subscription[];
}

export const UpcomingRenewals = ({ renewals }: UpcomingRenewalsProps) => {
  if (renewals.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-card animate-fade-in">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-primary" />
          Upcoming Renewals
        </h2>
        <div className="text-center py-8 text-muted-foreground">
          <CalendarClock className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No renewals in the next 7 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-card animate-fade-in">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <CalendarClock className="w-5 h-5 text-primary" />
        Upcoming Renewals
        <span className="ml-auto text-xs font-normal text-muted-foreground">
          Next 7 days
        </span>
      </h2>
      <div className="space-y-3">
        {renewals.map((sub, index) => {
          const daysUntil = getDaysUntilRenewal(sub.nextRenewalDate);
          const isUrgent = daysUntil <= 1;
          
          return (
            <div
              key={sub.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-md bg-secondary/50 animate-slide-in",
                isUrgent && "bg-warning/10 border border-warning/20"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-3">
                {isUrgent && <AlertCircle className="w-4 h-4 text-warning" />}
                <div>
                  <p className="font-medium text-foreground">{sub.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(sub.nextRenewalDate), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">{formatCurrency(sub.amount)}</p>
                <p className={cn(
                  "text-xs",
                  isUrgent ? "text-warning font-medium" : "text-muted-foreground"
                )}>
                  {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
