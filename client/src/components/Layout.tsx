import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, FileText, BarChart2, Users } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const menuItems = [
  { label: "Dashboard", path: "/", icon: Home },
  { label: "Loans", path: "/loans", icon: FileText },
  { label: "Applications", path: "/applications", icon: Users },
  { label: "Reports", path: "/reports", icon: BarChart2 },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const NavLink = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location === item.path;
    const Icon = item.icon;

    return (
      <Link href={item.path}>
        <a
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
              ? "bg-[#064296] text-white shadow-md"
              : "text-[#2E2E36] hover:bg-[#064296]/10 hover:text-[#064296]"
          }`}
          onClick={() => setOpen(false)}
        >
          <Icon className="mr-3 h-5 w-5" />
          {item.label}
        </a>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col bg-white border-r shadow-lg">
        <div className="p-6 border-b bg-gradient-to-r from-[#064296] to-[#064296]/90">
          <h1 className="text-2xl font-bold text-white">
            Loan Admin
          </h1>
        </div>
        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="flex h-16 items-center px-4 bg-gradient-to-r from-[#064296] to-[#064296]/90">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-4 text-white hover:bg-white/20">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b bg-gradient-to-r from-[#064296] to-[#064296]/90">
                <h1 className="text-2xl font-bold text-white">
                  Loan Admin
                </h1>
              </div>
              <nav className="space-y-2 p-4">
                {menuItems.map((item) => (
                  <NavLink key={item.path} item={item} />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <h1 className="text-lg font-semibold text-white">Loan Admin</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:pl-64 min-h-screen">
        <div className="container mx-auto p-4 lg:p-8 max-w-7xl">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">{children}</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}