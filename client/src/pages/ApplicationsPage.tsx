import LoanForm from "@/components/loans/LoanForm";

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">New Loan Application</h1>
      </div>
      <LoanForm />
    </div>
  );
}
