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
import { useEffect } from "react";
import { Loan } from "@/types";

const statusColors: Record<Loan['status'], string> = {
  pending: "bg-yellow-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  active: "bg-blue-500",
  closed: "bg-gray-500",
};

export default function LoanList() {
  const { loans, fetchLoans, updateLoanStatus } = useLoanStore();

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const handleStatusChange = async (id: number, status: Loan['status']) => {
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
              <TableRow key={loan.id}>
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
                        onClick={() => handleStatusChange(loan.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleStatusChange(loan.id, "rejected")}
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
    </div>
  );
}
