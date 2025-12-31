import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: ReactNode;
  variant?: "default" | "primary" | "warning";
}

export const SummaryCard = ({ title, value, subtitle, icon, variant = "default" }: SummaryCardProps) => {
  return (
    <div className="bg-card rounded-lg p-5 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "text-2xl font-semibold",
            variant === "primary" && "text-primary",
            variant === "warning" && "text-warning",
            variant === "default" && "text-foreground"
          )}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          variant === "primary" && "bg-accent text-accent-foreground",
          variant === "warning" && "bg-warning/10 text-warning",
          variant === "default" && "bg-secondary text-secondary-foreground"
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};
