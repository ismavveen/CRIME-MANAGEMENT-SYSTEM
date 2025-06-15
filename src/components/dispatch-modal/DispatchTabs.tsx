
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportOverviewSection from './ReportOverviewSection';
import LocationInfoSection from './LocationInfoSection';
import EvidenceSection from './EvidenceSection';
import ReporterInfoSection from './ReporterInfoSection';

interface DispatchTabsProps {
  report: any;
  onViewMedia: (url: string, type: 'image' | 'video') => void;
}

const DispatchTabs = ({ report, onViewMedia }: DispatchTabsProps) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-gray-700/50">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="evidence">Evidence</TabsTrigger>
        <TabsTrigger value="reporter">Reporter</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <ReportOverviewSection report={report} />
      </TabsContent>

      <TabsContent value="location" className="space-y-4">
        <LocationInfoSection report={report} />
      </TabsContent>

      <TabsContent value="evidence" className="space-y-4">
        <EvidenceSection report={report} onViewMedia={onViewMedia} />
      </TabsContent>

      <TabsContent value="reporter" className="space-y-4">
        <ReporterInfoSection report={report} />
      </TabsContent>
    </Tabs>
  );
};

export default DispatchTabs;
