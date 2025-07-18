import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SettingsProvider } from '@/contexts/SettingsContext';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ReportCrime from "./pages/ReportCrime";
import Reports from "./pages/Reports";
import UnitCommanders from "./pages/UnitCommanders";
import Users from "./pages/Users";
import Calendar from "./pages/Calendar";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
import Charts from "./pages/Charts";
import CommanderPortal from "./pages/CommanderPortal";
import EmergencyContacts from "./pages/EmergencyContacts";
import Emergency from "./pages/Emergency";
import Guidelines from "./pages/Guidelines";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import FAQs from "./pages/FAQs";
import HowToReport from "./pages/HowToReport";
import WhatToReport from "./pages/WhatToReport";
import TrackReport from "./pages/TrackReport";
import ReportCrimeWithChat from "./pages/ReportCrimeWithChat";
import AuditDashboard from "./pages/AuditDashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import EmergencyLocation from "./pages/EmergencyLocation";
import DashboardLayout from "./components/DashboardLayout";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SettingsProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<DashboardLayout><Index /></DashboardLayout>} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/report" element={<ReportCrime />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/emergency-contacts" element={<EmergencyContacts />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/how-to-report" element={<HowToReport />} />
              <Route path="/what-to-report" element={<WhatToReport />} />
              <Route path="/track-report" element={<TrackReport />} />
              <Route path="/report-with-chat" element={<ReportCrimeWithChat />} />
              
              {/* Protected Routes */}
              <Route path="/reports" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Reports />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
                <Route path="/reports/:tab" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Reports />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
              <Route path="/unit-commanders" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <UnitCommanders />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Users />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Calendar />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/inbox" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Inbox />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Settings />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/charts" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Charts />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/commander-portal" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <CommanderPortal />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              <Route path="/audit" element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <AuditDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } />
              
              <Route path="/emergency-location" element={<EmergencyLocation />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
          </SettingsProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
