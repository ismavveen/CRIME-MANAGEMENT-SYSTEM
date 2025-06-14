
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Clock, User, Activity, Eye, Download, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ReportAuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
  reportTitle?: string;
}

const ReportAuditModal = ({ open, onOpenChange, reportId, reportTitle }: ReportAuditModalProps) => {
  const { getReportAuditTrail, getReportAccessLogs, logReportAccess } = useAuditLogs();
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [accessLogs, setAccessLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    if (open && reportId) {
      loadAuditData();
      // Log that admin accessed the audit trail
      logReportAccess(reportId, 'audit_view', undefined, undefined, 'Administrative audit review');
    }
  }, [open, reportId]);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const [trail, access] = await Promise.all([
        getReportAuditTrail(reportId),
        getReportAccessLogs(reportId)
      ]);
      setAuditTrail(trail);
      setAccessLogs(access);
    } catch (error) {
      console.error('Error loading audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportAuditReport = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const reportData = {
      report_id: reportId,
      report_title: reportTitle || 'Unknown Report',
      export_date: new Date().toISOString(),
      changes: auditTrail,
      access_history: accessLogs
    };

    const csvContent = "data:text/csv;charset=utf-8," + 
      "Type,Timestamp,Action,Field,Previous Value,New Value,User,Details\n" +
      [
        ...auditTrail.map(change => 
          `Change,${change.created_at},${change.audit_log?.action_type || 'update'},${change.field_changed},${change.previous_value || ''},${change.new_value || ''},${change.audit_log?.actor_id || 'System'},${change.change_reason || ''}`
        ),
        ...accessLogs.map(access => 
          `Access,${access.created_at},${access.access_type},,,,${access.audit_log?.actor_id || 'Anonymous'},${access.purpose || ''}`
        )
      ].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_audit_${reportId.slice(0, 8)}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const combinedTimeline = [
    ...auditTrail.map(item => ({
      ...item,
      type: 'change',
      timestamp: item.created_at,
      sortTime: new Date(item.created_at).getTime()
    })),
    ...accessLogs.map(item => ({
      ...item,
      type: 'access',
      timestamp: item.created_at,
      sortTime: new Date(item.created_at).getTime()
    }))
  ].sort((a, b) => b.sortTime - a.sortTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-800 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2 text-white">
              <FileText className="h-5 w-5 text-blue-400" />
              <span>Audit Trail - {reportTitle || `Report ${reportId.slice(0, 8)}`}</span>
            </DialogTitle>
            <Button 
              onClick={exportAuditReport} 
              variant="outline" 
              size="sm"
              className="border-gray-600 text-gray-300"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </DialogHeader>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-400">Loading audit data...</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-700 mb-4">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="changes">Changes ({auditTrail.length})</TabsTrigger>
              <TabsTrigger value="access">Access Logs ({accessLogs.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {combinedTimeline.map((item, index) => (
                    <div key={`${item.type}-${item.id}`} className="flex items-start space-x-4 p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {item.type === 'change' ? (
                          <Activity className="h-4 w-4 text-orange-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-white font-medium">
                            {item.type === 'change' 
                              ? `${item.field_changed} changed` 
                              : `${item.access_type} access`
                            }
                          </p>
                          <p className="text-gray-400 text-sm">
                            {format(new Date(item.timestamp), 'MMM dd, HH:mm:ss')}
                          </p>
                        </div>
                        
                        <div className="mt-1 text-sm">
                          {item.type === 'change' ? (
                            <div className="space-y-1">
                              {item.previous_value && (
                                <div className="text-red-300">
                                  <span className="text-gray-400">From:</span> {item.previous_value}
                                </div>
                              )}
                              {item.new_value && (
                                <div className="text-green-300">
                                  <span className="text-gray-400">To:</span> {item.new_value}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-gray-300">
                              User: {item.audit_log?.actor_id ? 
                                `${item.audit_log.actor_id.slice(0, 8)}` : 
                                'Anonymous'
                              }
                              {item.duration_seconds && ` • Duration: ${item.duration_seconds}s`}
                              {item.purpose && ` • Purpose: ${item.purpose}`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="changes">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {auditTrail.map((change) => (
                    <div key={change.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-orange-400" />
                          <span>{change.field_changed} Modified</span>
                        </h4>
                        <div className="text-sm text-gray-400">
                          {format(new Date(change.created_at), 'MMM dd, yyyy HH:mm:ss')}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-gray-400 text-sm">Previous Value</label>
                          <div className="mt-1 p-3 bg-red-900/20 border border-red-700/50 rounded text-red-300">
                            {change.previous_value || 'None'}
                          </div>
                        </div>
                        <div>
                          <label className="text-gray-400 text-sm">New Value</label>
                          <div className="mt-1 p-3 bg-green-900/20 border border-green-700/50 rounded text-green-300">
                            {change.new_value || 'None'}
                          </div>
                        </div>
                      </div>
                      
                      {(change.change_reason || change.audit_log?.actor_id) && (
                        <div className="mt-3 pt-3 border-t border-gray-600/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            {change.change_reason && (
                              <div>
                                <span className="text-gray-400">Reason:</span>
                                <span className="text-white ml-2">{change.change_reason}</span>
                              </div>
                            )}
                            {change.audit_log?.actor_id && (
                              <div>
                                <span className="text-gray-400">Changed by:</span>
                                <span className="text-white ml-2">
                                  {change.audit_log.actor_id.slice(0, 8)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="access">
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {accessLogs.map((access) => (
                    <div key={access.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-semibold flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-blue-400" />
                          <span className="capitalize">{access.access_type} Access</span>
                        </h4>
                        <div className="text-sm text-gray-400">
                          {format(new Date(access.created_at), 'MMM dd, yyyy HH:mm:ss')}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">User:</span>
                          <span className="text-white ml-2">
                            {access.audit_log?.actor_id ? 
                              access.audit_log.actor_id.slice(0, 8) : 
                              'Anonymous'
                            }
                          </span>
                        </div>
                        {access.duration_seconds && (
                          <div>
                            <span className="text-gray-400">Duration:</span>
                            <span className="text-white ml-2">{access.duration_seconds} seconds</span>
                          </div>
                        )}
                        {access.audit_log?.ip_address && (
                          <div>
                            <span className="text-gray-400">IP Address:</span>
                            <span className="text-white ml-2">{access.audit_log.ip_address}</span>
                          </div>
                        )}
                      </div>
                      
                      {access.purpose && (
                        <div className="mt-3 pt-3 border-t border-gray-600/50">
                          <span className="text-gray-400">Purpose:</span>
                          <span className="text-white ml-2">{access.purpose}</span>
                        </div>
                      )}
                      
                      {access.accessed_sections && (
                        <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs">
                          <span className="text-gray-400">Sections Accessed:</span>
                          <pre className="text-gray-300 mt-1 whitespace-pre-wrap">
                            {JSON.stringify(access.accessed_sections, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReportAuditModal;
