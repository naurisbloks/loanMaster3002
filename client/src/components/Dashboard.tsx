import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLoanStore } from "@/stores/loanStore";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, Users, Clock, CheckCircle, Search, UserPlus, Package, Wallet, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { loans, fetchLoans } = useLoanStore();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

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

  const QuickActionButton = ({ icon: Icon, label, onClick }: any) => (
    <Button
      variant="outline"
      className="h-32 flex-col gap-3 flex-1 border-2 hover:bg-[#064296] hover:text-white transition-all duration-200 group cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="rounded-full bg-[#064296]/10 p-3 group-hover:bg-white/20">
        <Icon className="h-8 w-8 text-[#064296] group-hover:text-white" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );

  const StatCard = ({ title, value, icon: Icon, subtitle }: any) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="absolute inset-0 bg-gradient-to-br from-[#064296]/5 to-transparent" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
        <CardTitle className="text-sm font-medium text-[#2E2E36]">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-[#064296]" />
      </CardHeader>
      <CardContent className="relative">
        <div className="text-2xl font-bold text-[#064296]">{value}</div>
        {subtitle && (
          <p className="text-xs text-[#2E2E36]/70 mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2E2E36]/50" />
        <Input
          className="pl-10"
          placeholder="Search clients, loans, or items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Quick Actions */}
      <Card className="overflow-hidden border-0 shadow-lg">
        <CardHeader className="border-b bg-gradient-to-r from-[#064296]/5 to-transparent">
          <CardTitle className="text-[#2E2E36]">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionButton
              icon={UserPlus}
              label="New Client"
              onClick={() => setLocation("/clients/new")}
            />
            <QuickActionButton
              icon={Package}
              label="New Item"
              onClick={() => setLocation("/items/new")}
            />
            <QuickActionButton
              icon={Wallet}
              label="New Pawn Loan"
              onClick={() => setLocation("/applications?type=pawn")}
            />
            <QuickActionButton
              icon={CreditCard}
              label="New Consumer Loan"
              onClick={() => setLocation("/applications?type=consumer")}
            />
          </div>
        </CardContent>
      </Card>

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
        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#064296]/5 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="text-[#2E2E36]">Loans by Type</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loansByType}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#064296"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#064296]/5 to-transparent" />
          <CardHeader className="relative">
            <CardTitle className="text-[#2E2E36]">Amount Distribution</CardTitle>
          </CardHeader>
          <CardContent className="relative">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loansByType}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                    formatter={(value) => [`$${value}`, "Amount"]}
                  />
                  <Bar
                    dataKey="amount"
                    fill="#43B02A"
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