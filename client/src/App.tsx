import { Switch, Route } from "wouter";
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
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <Layout>{children}</Layout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/applications">
        {() => (
          <PrivateRoute>
            <ApplicationsPage />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/loans">
        {() => (
          <PrivateRoute>
            <LoansPage />
          </PrivateRoute>
        )}
      </Route>
      <Route path="/">
        {() => (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )}
      </Route>
      <Route component={NotFound} />
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