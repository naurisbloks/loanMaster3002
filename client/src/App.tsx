import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import LoanList from "@/components/loans/LoanList";
import LoanForm from "@/components/loans/LoanForm";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/not-found";
import { useAuthStore } from "@/stores/authStore";

function PrivateRoute({ component: Component, ...rest }: any) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    window.location.href = "/login";
    return null;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />

      {/* Protected Routes */}
      <Route path="/">
        <Layout>
          <Switch>
            <Route path="/" component={() => <PrivateRoute component={Dashboard} />} />
            <Route path="/loans" component={() => <PrivateRoute component={LoanList} />} />
            <Route path="/applications" component={() => <PrivateRoute component={LoanForm} />} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
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