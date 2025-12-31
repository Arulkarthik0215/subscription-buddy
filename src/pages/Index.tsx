import { useState } from "react";
import { DollarSign, CreditCard, TrendingUp, Plus } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { UpcomingRenewals } from "@/components/dashboard/UpcomingRenewals";
import { SubscriptionList } from "@/components/subscriptions/SubscriptionList";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { DeleteConfirmDialog } from "@/components/subscriptions/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { useSubscriptions } from "@/hooks/useSubscriptions";
import { formatCurrency } from "@/lib/subscriptions";
import type { Subscription } from "@/types/subscription";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const {
    subscriptions,
    isLoaded,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    totalMonthly,
    totalYearly,
    upcomingRenewals,
  } = useSubscriptions();

  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; subscription: Subscription | null }>({
    open: false,
    subscription: null,
  });

  const handleAdd = () => {
    setEditingSubscription(null);
    setIsFormOpen(true);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const subscription = subscriptions.find((s) => s.id === id);
    if (subscription) {
      setDeleteConfirm({ open: true, subscription });
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.subscription) {
      deleteSubscription(deleteConfirm.subscription.id);
      toast({
        title: "Subscription deleted",
        description: `"${deleteConfirm.subscription.name}" has been removed.`,
      });
    }
    setDeleteConfirm({ open: false, subscription: null });
  };

  const handleFormSubmit = (data: Omit<Subscription, "id" | "nextRenewalDate">) => {
    if (editingSubscription) {
      updateSubscription(editingSubscription.id, data);
      toast({
        title: "Subscription updated",
        description: `"${data.name}" has been updated.`,
      });
    } else {
      addSubscription(data);
      toast({
        title: "Subscription added",
        description: `"${data.name}" is now being tracked.`,
      });
    }
    setEditingSubscription(null);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6 space-y-8">
        {/* Summary Section */}
        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SummaryCard
              title="Monthly Spending"
              value={formatCurrency(totalMonthly)}
              subtitle="Estimated per month"
              icon={<DollarSign className="w-5 h-5" />}
              variant="primary"
            />
            <SummaryCard
              title="Active Subscriptions"
              value={subscriptions.length.toString()}
              subtitle={subscriptions.length === 1 ? "subscription" : "subscriptions"}
              icon={<CreditCard className="w-5 h-5" />}
            />
            <SummaryCard
              title="Yearly Spending"
              value={formatCurrency(totalYearly)}
              subtitle="Projected annually"
              icon={<TrendingUp className="w-5 h-5" />}
              variant="default"
            />
          </div>
        </section>

        {/* Upcoming Renewals Section */}
        <section>
          <UpcomingRenewals renewals={upcomingRenewals} />
        </section>

        {/* Subscriptions Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">All Subscriptions</h2>
            <Button onClick={handleAdd} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Subscription
            </Button>
          </div>
          <SubscriptionList
            subscriptions={subscriptions}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        </section>
      </main>

      <SubscriptionForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        editingSubscription={editingSubscription}
      />

      <DeleteConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ ...deleteConfirm, open })}
        onConfirm={handleDeleteConfirm}
        subscriptionName={deleteConfirm.subscription?.name || ""}
      />
    </div>
  );
};

export default Index;
