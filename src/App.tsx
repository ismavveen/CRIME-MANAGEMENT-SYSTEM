
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import HomePage from "./components/HomePage";
import InteractiveReportForm from "./components/InteractiveReportForm";
import FAQs from "./pages/FAQs";
import EmergencyContacts from "./pages/EmergencyContacts";
import HowToReport from "./pages/HowToReport";
import WhatToReport from "./pages/WhatToReport";
=======
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import TrackReport from "./pages/TrackReport";
import ReportCrime from "./pages/ReportCrime";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Charts from "./pages/Charts";
import UnitCommanders from "./pages/UnitCommanders";
import CommanderPortal from "./pages/CommanderPortal";
import Calendar from "./pages/Calendar";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
>>>>>>> d71de7c09fb1777f75ed51d097572c5fcf878f0f
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
<<<<<<< HEAD
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<InteractiveReportForm />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/emergency-contacts" element={<EmergencyContacts />} />
          <Route path="/how-to-report" element={<HowToReport />} />
          <Route path="/what-to-report" element={<WhatToReport />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
=======
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/report" element={<ReportCrime />} />
            <Route path="/track" element={<TrackReport />} />
            <Route path="/commander-portal" element={<CommanderPortal />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <Users />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/charts" element={
              <ProtectedRoute>
                <Charts />
              </ProtectedRoute>
            } />
            <Route path="/unit-commanders" element={
              <ProtectedRoute>
                <UnitCommanders />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/inbox" element={
              <ProtectedRoute>
                <Inbox />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
>>>>>>> d71de7c09fb1777f75ed51d097572c5fcf878f0f
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
