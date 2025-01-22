import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, FileText, BarChart2, Users } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { UserNav } from "./UserNav";
import { LanguageSelector } from "./LanguageSelector";
import { useTranslation } from "react-i18next";

function getMenuItems(t: (key: string) => string) {
  return [
    { label: t("nav.dashboard"), path: "/", icon: Home },
    { label: t("nav.loans"), path: "/loans", icon: FileText },
    { label: t("nav.applications"), path: "/applications", icon: BarChart2 },
    { label: t("nav.clients"), path: "/clients", icon: Users },
    { label: t("nav.reports"), path: "/reports", icon: BarChart2 },
  ];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const menuItems = getMenuItems(t);

  const NavLink = ({ item }: { item: typeof menuItems[0] }) => {
    const isActive = location === item.path;
    const Icon = item.icon;

    return (
      <Button
        variant="ghost"
        className={`w-full justify-start gap-2 ${
          isActive
            ? "bg-[#064296] text-white hover:bg-[#064296]/90 hover:text-white"
            : "text-[#2E2E36] hover:bg-[#064296]/10 hover:text-[#064296]"
        }`}
        onClick={() => {
          setLocation(item.path);
          setOpen(false);
        }}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r">
        <div className="flex flex-col flex-grow">
          <div className="flex items-center h-16 px-4 border-b bg-gradient-to-r from-[#064296] to-[#064296]/90">
            <h1 className="text-xl font-bold text-white">Loan Admin</h1>
          </div>
          <nav className="flex-1 px-2 py-2 space-y-1">
            {menuItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b">
        <div className="flex h-16 items-center justify-between px-4 bg-gradient-to-r from-[#064296] to-[#064296]/90">
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex items-center h-16 px-4 border-b bg-gradient-to-r from-[#064296] to-[#064296]/90">
                  <h1 className="text-xl font-bold text-white">Loan Admin</h1>
                </div>
                <nav className="px-2 py-2 space-y-1">
                  {menuItems.map((item) => (
                    <NavLink key={item.path} item={item} />
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-white ml-4">Loan Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <UserNav />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex md:fixed md:left-64 right-0 h-16 items-center justify-end px-6 border-b bg-white z-10">
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <UserNav />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 md:pt-16">
        <div className="px-4 py-4 md:px-8 md:py-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}