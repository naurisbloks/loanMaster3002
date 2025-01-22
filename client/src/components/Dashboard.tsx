import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoanStore } from "@/stores/loanStore";
import { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Users, Clock, CheckCircle } from "lucide-react";

export default function Dashboard() {
  const { loans, fetchLoans } = useLoanStore();

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  const loanStats = {
    total: loans.length,
    active: loans.filter((l) => l.status === "active").length,
    pending: loans.filter((l) => l.status === "pending").length,
    totalAmount: loans.reduce((sum, loan) => sum + Number(loan.amount), 0),
  };

  const loansByType = [
    {
      type: "Pawn",
      count: loans.filter((l) => l.type === "pawn").length,
      amount: loans
        .filter((l) => l.type === "pawn")
        .reduce((sum, loan) => sum + Number(loan.amount), 0),
    },
    {
      type: "Consumer",
      count: loans.filter((l) => l.type === "consumer").length,
      amount: loans
        .filter((l) => l.type === "consumer")
        .reduce((sum, loan) => sum + Number(loan.amount), 0),
    },
    {
      type: "Retail",
      count: loans.filter((l) => l.type === "retail").length,
      amount: loans
        .filter((l) => l.type === "retail")
        .reduce((sum, loan) => sum + Number(loan.amount), 0),
    },
  ];

  const StatCard = ({ title, value, icon: Icon, subtitle }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Loan Amount"
          value={`$${loanStats.totalAmount.toLocaleString()}`}
          icon={DollarSign}
          subtitle="Across all loan types"
        />
        <StatCard
          title="Total Loans"
          value={loanStats.total}
          icon={Users}
          subtitle="Active and pending loans"
        />
        <StatCard
          title="Active Loans"
          value={loanStats.active}
          icon={CheckCircle}
          subtitle="Currently active loans"
        />
        <StatCard
          title="Pending Applications"
          value={loanStats.pending}
          icon={Clock}
          subtitle="Awaiting approval"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loans by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loansByType}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amount Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loansByType}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                    formatter={(value) => [`$${value}`, "Amount"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}