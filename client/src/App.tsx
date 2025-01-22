import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import LoansPage from "@/pages/LoansPage";
import ApplicationsPage from "@/pages/ApplicationsPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";
import { useAuthStore } from "@/stores/authStore";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    setLocation("/login");
    return null;
  }

  return <Layout>{children}</Layout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />

      <Route path="/">
        {() => (
          <PrivateRoute>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/loans" component={LoansPage} />
              <Route path="/applications" component={ApplicationsPage} />
              <Route component={NotFound} />
            </Switch>
          </PrivateRoute>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;