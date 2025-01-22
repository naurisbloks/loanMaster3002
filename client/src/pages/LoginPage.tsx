import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/stores/authStore";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const login = useAuthStore((state) => state.login);

  const handleMsLogin = async () => {
    setIsLoading(true);
    // Mock Microsoft login with user data
    setTimeout(() => {
      login({
        firstName: "John",
        lastName: "Smith",
        branch: "San Francisco Branch",
      });
      setLocation("/");
    }, 1000);
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock password login with user data
    setTimeout(() => {
      login({
        firstName: "John",
        lastName: "Smith",
        branch: "San Francisco Branch",
      });
      setLocation("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#064296] to-[#064296]/90 bg-clip-text text-transparent">
            Loan Admin Portal
          </CardTitle>
          <p className="text-sm text-[#2E2E36]/70">
            Sign in to access your dashboard
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showPasswordLogin ? (
            <>
              <Button
                className="w-full bg-[#064296] hover:bg-[#064296]/90 text-white"
                size="lg"
                onClick={handleMsLogin}
                disabled={isLoading}
              >
                <User className="mr-2 h-5 w-5" />
                Sign in with Microsoft
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#2E2E36]/70">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPasswordLogin(true)}
              >
                Email & Password
              </Button>
            </>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Email address"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#064296] hover:bg-[#064296]/90 text-white"
                size="lg"
                disabled={isLoading}
              >
                Sign In
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowPasswordLogin(false)}
                disabled={isLoading}
              >
                Back to Microsoft login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}