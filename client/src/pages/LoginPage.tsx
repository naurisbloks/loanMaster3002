import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { User } from "lucide-react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/stores/authStore";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { t } = useTranslation();

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
      <div className="absolute top-4 right-4">
        <LanguageSelector variant="login" />
      </div>
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#064296] to-[#064296]/90 bg-clip-text text-transparent">
            {t("auth.signIn")}
          </CardTitle>
          <p className="text-sm text-[#2E2E36]/70">
            {t("auth.signInDesc")}
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
                {t("auth.withMicrosoft")}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#2E2E36]/70">
                    {t("auth.or")}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPasswordLogin(true)}
              >
                {t("auth.withEmail")}
              </Button>
            </>
          ) : (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder={t("auth.email")}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder={t("auth.password")}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#064296] hover:bg-[#064296]/90 text-white"
                size="lg"
                disabled={isLoading}
              >
                {t("auth.signIn")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setShowPasswordLogin(false)}
                disabled={isLoading}
              >
                {t("auth.backToMicrosoft")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}