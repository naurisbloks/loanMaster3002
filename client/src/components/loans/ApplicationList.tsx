import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLoanStore } from "@/stores/loanStore";
import { useEffect, useState } from "react";
import { Loan } from "@/types";
import LoanDetails from "./LoanDetails";

const statusColors: Record<Loan['status'], string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  active: "bg-blue-500",
  closed: "bg-gray-500",
};

export default function ApplicationList() {
  const { loans, fetchLoans, updateLoanStatus } = useLoanStore();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    // Fetch loans when component mounts
    fetchLoans();
    // Also set up a polling interval to check for new applications
    const interval = setInterval(fetchLoans, 5000);
    return () => clearInterval(interval);
  }, [fetchLoans]);

  // Filter only pending applications
  const applications = loans.filter(loan => loan.status === "pending");

  const handleRowClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (e: React.MouseEvent, id: number, status: Loan['status']) => {
    e.stopPropagation();
    await updateLoanStatus(id, status);
    // Refetch loans after status update
    fetchLoans();
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((loan) => (
              <TableRow
                key={loan.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(loan)}
              >
                <TableCell>{loan.id}</TableCell>
                <TableCell className="capitalize">{loan.type}</TableCell>
                <TableCell>${loan.amount}</TableCell>
                <TableCell>
                  {new Date(loan.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      onClick={(e) => handleStatusChange(e, loan.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => handleStatusChange(e, loan.id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <LoanDetails
        loan={selectedLoan}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </div>
  );
}