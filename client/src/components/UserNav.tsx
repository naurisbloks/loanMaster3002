import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLocation } from "wouter";

export function UserNav() {
  const { user, logout } = useAuthStore();
  const [, setLocation] = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <div className="font-medium text-sm">
          {user.firstName} {user.lastName}
        </div>
        <div className="text-xs text-muted-foreground">
          {user.branch}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-[#064296] hover:text-[#064296]/90 hover:bg-[#064296]/10"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
}