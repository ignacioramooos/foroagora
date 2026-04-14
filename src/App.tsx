import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import ProgramPage from "./pages/ProgramPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import ResourcesPage from "./pages/ResourcesPage";
import PartnersPage from "./pages/PartnersPage";
import BrokersPage from "./pages/BrokersPage";
import GlossaryPage from "./pages/GlossaryPage";
import FormacionPage from "./pages/FormacionPage";
import RankingPage from "./pages/RankingPage";
import ImpactPage from "./pages/ImpactPage";
import CaseStudiesPage from "./pages/CaseStudiesPage";
import CaseStudyDetailPage from "./pages/CaseStudyDetailPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PublicPage = ({ children }: { children: React.ReactNode }) => (
  <><Navbar /><main>{children}</main><Footer /></>
);

const AppRoutes = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-muted-foreground text-sm font-heading">Cargando...</span>
      </div>
    );
  }

  const publicRoutes = (
    <>
      <Route path="/" element={<PublicPage><Index /></PublicPage>} />
      <Route path="/nosotros" element={<PublicPage><AboutPage /></PublicPage>} />
      <Route path="/programa" element={<PublicPage><ProgramPage /></PublicPage>} />
      <Route path="/registro" element={<PublicPage><RegisterPage /></PublicPage>} />
      <Route path="/contacto" element={<PublicPage><ContactPage /></PublicPage>} />
      <Route path="/recursos" element={<PublicPage><ResourcesPage /></PublicPage>} />
      <Route path="/glosario" element={<PublicPage><GlossaryPage /></PublicPage>} />
      <Route path="/partners" element={<Navigate to="/alianzas" replace />} />
      <Route path="/alianzas" element={<PublicPage><PartnersPage /></PublicPage>} />
      <Route path="/brokers" element={<PublicPage><BrokersPage /></PublicPage>} />
      <Route path="/analisis" element={<PublicPage><CaseStudiesPage /></PublicPage>} />
      <Route path="/analisis/:id" element={<PublicPage><CaseStudyDetailPage /></PublicPage>} />
      <Route path="/formacion" element={<FormacionPage />} />
      <Route path="/ranking" element={<RankingPage />} />
      <Route path="/impacto" element={<ImpactPage />} />
      <Route path="/auth" element={<AuthPage />} />
    </>
  );

  if (isLoggedIn) {
    return (
      <>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {publicRoutes}
          <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
        </Routes>
        <WhatsAppButton />
      </>
    );
  }

  return (
    <>
      <Routes>
        {publicRoutes}
        <Route path="/dashboard" element={<Navigate to="/auth" replace />} />
        <Route path="*" element={<PublicPage><NotFound /></PublicPage>} />
      </Routes>
      <WhatsAppButton />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
