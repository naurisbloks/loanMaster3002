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
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

const menuItems = [
  { label: "Dashboard", path: "/" },
  { label: "Loans", path: "/loans" },
  { label: "Applications", path: "/applications" },
  { label: "Reports", path: "/reports" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold">Loan Admin</h1>
        </div>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <a
                className={`block px-4 py-2 hover:bg-sidebar-accent ${
                  location === item.path ? "bg-sidebar-accent" : ""
                }`}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" className="p-2">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4">
            <h1 className="text-xl font-bold">Loan Admin</h1>
          </div>
          <nav>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setOpen(false)}
              >
                <a
                  className={`block px-4 py-2 hover:bg-sidebar-accent ${
                    location === item.path ? "bg-sidebar-accent" : ""
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background">
        <Card className="m-4">
          <CardContent className="p-6">{children}</CardContent>
        </Card>
      </main>
    </div>
  );
}
