import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loan } from "@/types";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { useLoanStore } from "@/stores/loanStore";

const statusColors: Record<Loan['status'], string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  active: "bg-blue-500",
  closed: "bg-gray-500",
};

const loanSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  interestRate: z.coerce.number().min(0, "Interest rate cannot be negative"),
  term: z.coerce.number().min(1, "Term must be at least 1 month"),
  purpose: z.string().optional(),
  collateral: z.string().optional(),
});

interface LoanDetailsProps {
  loan: Loan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoanDetails({ loan, open, onOpenChange }: LoanDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateLoan } = useLoanStore();

  const form = useForm({
    resolver: zodResolver(loanSchema),
    defaultValues: loan || {},
  });

  // Reset form when loan changes
  useEffect(() => {
    if (loan) {
      form.reset(loan);
    }
  }, [loan, form]);

  if (!loan) return null;

  const onSubmit = async (data: z.infer<typeof loanSchema>) => {
    try {
      await updateLoan(loan.id, data);
      setIsEditing(false);
      // Reset form with new values after successful update
      form.reset(data);
    } catch (error) {
      console.error("Failed to update loan:", error);
    }
  };

  const DetailField = ({ label, value, fieldName, type = "text" }: { label: string; value: string | number; fieldName: keyof Loan; type?: string }) => (
    <div>
      <p className="text-sm font-medium">{label}</p>
      {isEditing ? (
        <Input
          type={type}
          className="mt-1"
          {...form.register(fieldName)}
        />
      ) : (
        <p className="text-sm">{form.getValues(fieldName) || value}</p>
      )}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SheetHeader className="flex flex-row items-center justify-between">
            <div>
              <SheetTitle className="text-2xl">Loan Details</SheetTitle>
              <SheetDescription>
                View and edit loan information
              </SheetDescription>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
              disabled={loan.status !== "pending"}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Loan Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Loan Type</p>
                  <p className="text-sm capitalize">{loan.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={statusColors[loan.status]}>
                    {loan.status}
                  </Badge>
                </div>
                <DetailField
                  label="Amount ($)"
                  value={loan.amount}
                  fieldName="amount"
                  type="number"
                />
                <DetailField
                  label="Interest Rate (%)"
                  value={loan.interestRate}
                  fieldName="interestRate"
                  type="number"
                />
                <DetailField
                  label="Term (months)"
                  value={loan.term}
                  fieldName="term"
                  type="number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Purpose</h3>
              {isEditing ? (
                <Textarea
                  className="mt-1"
                  {...form.register("purpose")}
                />
              ) : (
                <p className="text-sm">{form.getValues("purpose") || loan.purpose}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Collateral</h3>
              {isEditing ? (
                <Textarea
                  className="mt-1"
                  {...form.register("collateral")}
                />
              ) : (
                <p className="text-sm">{form.getValues("collateral") || loan.collateral}</p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Dates</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Created On</p>
                  <p className="text-sm">{format(new Date(loan.createdAt), "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm">{format(new Date(loan.updatedAt), "PPP")}</p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset(loan);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}