import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import InfoPage from "./pages/InfoPage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import CreateRecipePage from "./pages/CreateRecipePage";
import EditRecipePage from "./pages/EditRecipePage";
import KBankPage from "./pages/KBankPage";
import FavoritesPage from "./pages/FavoritesPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import BottomNavigation from "./components/BottomNavigation";
import DesktopNav from "./components/DesktopNav";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        {/* 
          CRITICAL: The background uses CSS animation only — NO JS transforms.
          JS transforms (framer-motion scale) on a parent break position:fixed for ALL children.
          We use a pure CSS @keyframes 'ken-burns' animation instead.
        */}
        <div className="app-bg-layer" aria-hidden="true" />
        <div className="app-vignette-layer" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />
        <div className="atmos-mesh" aria-hidden="true" />
        <div className="smoke-layer" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', mixBlendMode: 'screen' }} />

        {/* Main scrollable content — no transform, no overflow:hidden */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/recipes/:id" element={<RecipeDetailPage />} />
            <Route path="/recipes/:id/edit" element={
              <ProtectedRoute>
                <EditRecipePage />
              </ProtectedRoute>
            } />
            <Route path="/create-recipe" element={
              <ProtectedRoute>
                <CreateRecipePage />
              </ProtectedRoute>
            } />
            <Route path="/k-bank" element={<KBankPage />} />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/info" element={<InfoPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>

        {/* 
          BottomNavigation is placed OUTSIDE all transforms and overflow:hidden containers.
          It is a direct child of BrowserRouter context, at z-50, ensuring true viewport-fixed position.
        */}
        <BottomNavigation />
        <DesktopNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
