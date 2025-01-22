import LoanList from "@/components/loans/LoanList";

export default function LoansPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loans</h1>
      </div>
      <LoanList />
    </div>
  );
}
