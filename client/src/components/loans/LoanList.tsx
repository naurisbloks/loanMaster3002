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

export default function LoanList() {
  const { loans, fetchLoans, updateLoanStatus } = useLoanStore();
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleRowClick = (loan: Loan) => {
    setSelectedLoan(loan);
    setDetailsOpen(true);
  };

  const handleStatusChange = async (e: React.MouseEvent, id: number, status: Loan['status']) => {
    e.stopPropagation(); // Prevent row click when clicking status buttons
    await updateLoanStatus(id, status);
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
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loans.map((loan) => (
              <TableRow
                key={loan.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(loan)}
              >
                <TableCell>{loan.id}</TableCell>
                <TableCell className="capitalize">{loan.type}</TableCell>
                <TableCell>${loan.amount}</TableCell>
                <TableCell>
                  <Badge className={statusColors[loan.status]}>
                    {loan.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(loan.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {loan.status === "pending" && (
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
                  )}
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