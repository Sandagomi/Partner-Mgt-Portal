import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { AuthGuard } from "@/components/AuthGuard";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PartnersPage from "./pages/PartnersPage";
import BrandsPage from "./pages/BrandsPage";
import SubBrandsPage from "./pages/SubBrandsPage";
import TablesPage from "./pages/TablesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/sub-brands" element={<SubBrandsPage />} />
              <Route path="/tables" element={<TablesPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
