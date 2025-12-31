import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { Subscription, BillingCycle, ReminderDays } from "@/types/subscription";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  billingCycle: z.enum(["monthly", "yearly"]),
  startDate: z.date({ required_error: "Start date is required" }),
  reminderDays: z.coerce.number().refine((val) => [1, 3, 7].includes(val), "Invalid reminder option"),
});

type FormData = z.infer<typeof formSchema>;

interface SubscriptionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Subscription, "id" | "nextRenewalDate">) => void;
  editingSubscription?: Subscription | null;
}

export const SubscriptionForm = ({
  open,
  onOpenChange,
  onSubmit,
  editingSubscription,
}: SubscriptionFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      amount: 0,
      billingCycle: "monthly",
      reminderDays: 3,
    },
  });

  const watchedDate = watch("startDate");
  const watchedBillingCycle = watch("billingCycle");

  useEffect(() => {
    if (editingSubscription) {
      reset({
        name: editingSubscription.name,
        amount: editingSubscription.amount,
        billingCycle: editingSubscription.billingCycle,
        startDate: new Date(editingSubscription.startDate),
        reminderDays: editingSubscription.reminderDays,
      });
    } else {
      reset({
        name: "",
        amount: 0,
        billingCycle: "monthly",
        startDate: undefined,
        reminderDays: 3,
      });
    }
  }, [editingSubscription, reset, open]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit({
      name: data.name.trim(),
      amount: data.amount,
      billingCycle: data.billingCycle as BillingCycle,
      startDate: format(data.startDate, "yyyy-MM-dd"),
      reminderDays: data.reminderDays as ReminderDays,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingSubscription ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subscription Name</Label>
            <Input
              id="name"
              placeholder="e.g., Netflix, Spotify"
              {...register("name")}
              className={cn(errors.name && "border-destructive")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="9.99"
                {...register("amount")}
                className={cn(errors.amount && "border-destructive")}
              />
              {errors.amount && (
                <p className="text-xs text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Billing Cycle</Label>
              <Select
                value={watchedBillingCycle}
                onValueChange={(value) => setValue("billingCycle", value as BillingCycle)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedDate && "text-muted-foreground",
                    errors.startDate && "border-destructive"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedDate ? format(watchedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={watchedDate}
                  onSelect={(date) => date && setValue("startDate", date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-xs text-destructive">{errors.startDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Remind me before renewal</Label>
            <Select
              value={watch("reminderDays")?.toString()}
              onValueChange={(value) => setValue("reminderDays", parseInt(value) as ReminderDays)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reminder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day before</SelectItem>
                <SelectItem value="3">3 days before</SelectItem>
                <SelectItem value="7">7 days before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editingSubscription ? "Save Changes" : "Add Subscription"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
