
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Clock, User, Shield, AlertTriangle, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LocationInfoSection from './dispatch-modal/LocationInfoSection';
import EvidenceSection from './dispatch-modal/EvidenceSection';
import ReporterInfoSection from './dispatch-modal/ReporterInfoSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportDetailsModalProps {
  report: any;
  onClose: () => void;
}

const ReportDetailsModal: React.FC<ReportDetailsModalProps> = ({ report, onClose }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "critical":
        return "bg-dhq-red text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-black";
      case "low":
        return "bg-green-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "bg-green-500 text-white";
      case "assigned":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleViewMedia = (url: string) => {
    window.open(url, '_blank');
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl text-white mb-2">
                Report Details
              </DialogTitle>
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Serial:</span>
                <span className="font-mono text-dhq-blue text-lg">
                  {report.serial_number || `DHQ-${report.id?.slice(0, 8)}`}
                </span>
                <Badge className={`${getPriorityColor(report.priority || report.urgency)} text-sm`}>
                  {(report.priority || report.urgency || 'Medium').toUpperCase()} PRIORITY
                </Badge>
                <Badge className={`${getStatusColor(report.status)} text-sm`}>
                  {(report.status || 'Pending').toUpperCase()}
                </Badge>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-700/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="reporter">Reporter</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Incident & System Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <InfoRow label="Threat Type" value={report.threat_type} />
                  <InfoRow label="Description" value={report.description} isBlock />
                  <InfoRow label="Report ID" value={report.id} isMono />
                  <InfoRow label="Priority Level" value={report.priority || report.urgency || 'Medium'} />
                  <InfoRow label="Anonymous" value={report.is_anonymous ? 'Yes' : 'No'} />
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-gray-400 flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Timeline & Assignment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <InfoRow label="Submitted" value={formatTime(report.created_at)} />
                  <InfoRow label="Last Updated" value={formatTime(report.updated_at)} />
                  <InfoRow label="Channel" value={report.reporter_type?.replace('_', ' ') || 'Web Portal'} />
                  <InfoRow label="Assigned To" value={report.assigned_to || 'Not assigned'} />
                  <InfoRow label="Acknowledged" value={report.acknowledged_at ? formatTime(report.acknowledged_at) : 'N/A'} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-4">
            <LocationInfoSection report={report} />
          </TabsContent>

          <TabsContent value="evidence" className="mt-4">
            <EvidenceSection report={report} onViewMedia={handleViewMedia} />
          </TabsContent>

          <TabsContent value="reporter" className="mt-4">
            <ReporterInfoSection report={report} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const InfoRow = ({ label, value, isMono = false, isBlock = false }: { label: string, value: any, isMono?: boolean, isBlock?: boolean }) => (
  <div>
    <p className="text-gray-400 text-xs">{label}</p>
    {isBlock ? (
      <p className="text-white text-sm bg-gray-800/50 p-2 rounded mt-1">{value || 'N/A'}</p>
    ) : (
      <p className={`text-white ${isMono ? 'font-mono' : ''}`}>{value || 'N/A'}</p>
    )}
  </div>
);


export default ReportDetailsModal;
