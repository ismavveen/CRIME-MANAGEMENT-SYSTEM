
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import InteractiveReportForm from "./components/InteractiveReportForm";
import FAQs from "./pages/FAQs";
import EmergencyContacts from "./pages/EmergencyContacts";
import HowToReport from "./pages/HowToReport";
import WhatToReport from "./pages/WhatToReport";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
