import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Loan } from "@/types";
import { format } from "date-fns";

interface LoanDetailsProps {
  loan: Loan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors: Record<Loan['status'], string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  active: "bg-blue-500",
  closed: "bg-gray-500",
};

export default function LoanDetails({ loan, open, onOpenChange }: LoanDetailsProps) {
  if (!loan) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="text-2xl">Loan Details</SheetTitle>
          <SheetDescription>
            View detailed information about the loan
          </SheetDescription>
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
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm">${loan.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Interest Rate</p>
                <p className="text-sm">{loan.interestRate}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Term</p>
                <p className="text-sm">{loan.term} months</p>
              </div>
            </div>
          </div>

          {loan.purpose && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Purpose</h3>
              <p className="text-sm">{loan.purpose}</p>
            </div>
          )}

          {loan.collateral && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Collateral</h3>
              <p className="text-sm">{loan.collateral}</p>
            </div>
          )}

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
        </div>
      </SheetContent>
    </Sheet>
  );
}
