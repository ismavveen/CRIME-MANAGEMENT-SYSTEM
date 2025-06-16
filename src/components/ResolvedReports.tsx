import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, CheckCircle, FileText, Loader2, Download } from 'lucide-react';
import { useReports, Report } from '@/hooks/useReports';
import ReportDetailsModal from './ReportDetailsModal';
import jsPDF from 'jspdf';

// Defence HQ logo as base64 (replace with your actual base64 string)
const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAYAAADn...";

const address = `DEFENCE HEADQUARTERS\nArea 7, Garki, Abuja,\nFederal Capital Territory (FCT), Nigeria.`;

const getField = (report: any, field: string, fallback: any = 'N/A') => {
  if (field === 'resolution_evidence') {
    const val = report && report[field];
    return Array.isArray(val) ? val : [];
  }
  return report && report[field] !== undefined && report[field] !== null && report[field] !== '' ? report[field] : fallback;
};

const ResolvedReports: React.FC = () => {
  const { reports, loading } = useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const resolvedStatuses = ['resolved', 'verified'];
  const resolvedReports = reports.filter(
    report => resolvedStatuses.includes(report.status.toLowerCase())
  );

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // PDF generation logic
  const handleDownloadPDF = (report: Report) => {
    const doc = new jsPDF();
    // Logo
    doc.addImage(logoBase64, 'PNG', 80, 10, 50, 50);
    doc.setFontSize(16);
    doc.text('OPERATIONAL SITUATION REPORT', 105, 70, { align: 'center' });
    doc.setFontSize(10);
    doc.text(address, 105, 80, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(10, 85, 200, 85);
    let y = 95;
    doc.setFontSize(12);
    doc.text(`State Command Center: ${getField(report, 'state', '')}`, 10, y); y += 7;
    doc.text(`LGA Command: ${getField(report, 'lga', '')}`, 10, y); y += 7;
    doc.text(`Report Reference: ${getField(report, 'id', '')}`, 10, y); y += 7;
    doc.text(`Date of Incident Report: ${report.created_at ? new Date(report.created_at).toLocaleDateString() : ''}`, 10, y); y += 7;
    doc.text(`Date of Resolution: ${getField(report, 'resolved_at') ? new Date(getField(report, 'resolved_at', ''))?.toLocaleDateString() : ''}`, 10, y); y += 7;
    doc.text(`Priority Level: ${getField(report, 'priority', '')}`, 10, y); y += 7;
    doc.text(`Threat Classification: ${getField(report, 'threat_type', '')}`, 10, y); y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('INCIDENT BRIEF', 10, y); y += 6; doc.setFont(undefined, 'normal');
    doc.text(getField(report, 'description', ''), 10, y, { maxWidth: 190 }); y += 12;
    doc.setFont(undefined, 'bold');
    doc.text('LOCATION', 10, y); y += 6; doc.setFont(undefined, 'normal');
    doc.text(getField(report, 'location', ''), 10, y, { maxWidth: 190 }); y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('RESOLUTION SUMMARY', 10, y); y += 6; doc.setFont(undefined, 'normal');
    doc.text('Actions Executed:', 10, y); y += 6;
    doc.text(getField(report, 'resolution_notes', ''), 15, y, { maxWidth: 185 }); y += 10;
    doc.text('Evidence Secured:', 10, y); y += 6;
    const evidenceArr = getField(report, 'resolution_evidence', []);
    if (Array.isArray(evidenceArr) && evidenceArr.length > 0) {
      evidenceArr.forEach((evidence: any, idx: number) => {
        doc.text(`- ${evidence.name}: ${evidence.url}`, 15, y, { maxWidth: 185 });
        y += 6;
      });
    } else {
      doc.text('None', 15, y); y += 6;
    }
    doc.text('Commanding Officer(s):', 10, y); y += 6;
    doc.text(`- Name: ${getField(report, 'commander_name')}`, 15, y); y += 6;
    doc.text(`- Rank: ${getField(report, 'commander_rank')}`, 15, y); y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('FINAL STATUS', 10, y); y += 6; doc.setFont(undefined, 'normal');
    doc.text(`Operation Outcome: ${report.status === 'verified' ? 'Verified' : 'Resolved'}`, 10, y); y += 6;
    doc.text(`Verified By: ${getField(report, 'verifier_name')} (${getField(report, 'verifier_rank')})`, 10, y); y += 6;
    doc.text(`Verification Date: ${getField(report, 'verified_at') ? new Date(getField(report, 'verified_at', ''))?.toLocaleDateString() : ''}`, 10, y); y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('ADDITIONAL REMARKS', 10, y); y += 6; doc.setFont(undefined, 'normal');
    doc.text(getField(report, 'additional_notes', ''), 10, y, { maxWidth: 190 }); y += 10;
    doc.setFont(undefined, 'bold');
    doc.text('CONTACT', 10, y); y += 6; doc.setFont(undefined, 'normal');
    doc.text('Defence Headquarters, Area 7, Garki, Abuja, FCT, Nigeria', 10, y); y += 6;
    doc.text(`Phone: ${getField(report, 'command_center_phone')}`, 10, y); y += 6;
    doc.text(`Email: ${getField(report, 'command_center_email')}`, 10, y); y += 10;
    doc.setFont(undefined, 'bold');
    doc.text(`Commanding Officer's Endorsement:`, 10, y); y += 6; doc.setFont(undefined, 'normal');
    doc.text(`Name: ${getField(report, 'commander_name')}`, 10, y); y += 6;
    doc.text(`Rank: ${getField(report, 'commander_rank')}`, 10, y); y += 6;
    doc.text(`Date: ${getField(report, 'verified_at') ? new Date(getField(report, 'verified_at', ''))?.toLocaleDateString() : ''}`, 10, y); y += 10;
    doc.save(`Operational_Report_${getField(report, 'id', 'report')}.pdf`);
  };

  return (
    <>
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Resolved Reports ({loading ? <Loader2 className="h-4 w-4 animate-spin" /> : resolvedReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
               <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                  <span className="ml-4 text-gray-400">Loading Resolved Reports...</span>
              </div>
          ) : (
              <div className="space-y-4">
              {resolvedReports.length > 0 ? resolvedReports.slice(0, 10).map((report) => (
                  <div key={report.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <h4 className="font-medium text-white">{getField(report, 'threat_type', '')}</h4>
                      </div>
                      <Badge className={`${getPriorityColor(getField(report, 'priority', ''))} border`}>
                      {getField(report, 'priority', '').toUpperCase()}
                      </Badge>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{getField(report, 'description', '')}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{getField(report, 'location', '') || getField(report, 'manual_location', '')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{report.created_at ? new Date(report.created_at).toLocaleDateString() : ''}</span>
                      </div>
                      <div className="flex items-center gap-1">
                          <Badge variant="outline" className={`${getField(report, 'status', '') === 'verified' ? 'border-teal-500 text-teal-300' : 'border-green-500 text-green-300'}`}>{getField(report, 'status', '')}</Badge>
                      </div>
                  </div>
                  <div className="flex justify-end mt-3 gap-2">
                      <Button size="sm" variant="outline" className="text-blue-400 border-blue-600 hover:bg-blue-900/50" onClick={() => handleViewDetails(report)}>
                          <FileText className="h-3 w-3 mr-1" />
                          View Details
                      </Button>
                      <Button size="sm" variant="outline" className="text-cyan-400 border-cyan-600 hover:bg-cyan-900/50" onClick={() => handleDownloadPDF(report)}>
                          <Download className="h-3 w-3 mr-1" />
                          Download PDF
                      </Button>
                  </div>
                  </div>
              )) : (
                  <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">No resolved reports</p>
                  <p className="text-gray-500 text-sm">Completed reports will appear here.</p>
                  </div>
              )}
              </div>
          )}
        </CardContent>
      </Card>
      <ReportDetailsModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </>
  );
};

export default ResolvedReports;
