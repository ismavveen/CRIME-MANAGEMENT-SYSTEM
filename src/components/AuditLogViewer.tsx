
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuditLogs, AuditLog } from '@/hooks/useAuditLogs';
import { Search, Filter, Clock, User, Activity, Shield, Eye, Download } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLogViewerProps {
  reportId?: string;
  className?: string;
}

const AuditLogViewer = ({ reportId, className }: AuditLogViewerProps) => {
  const { auditLogs, loading, fetchAuditLogs, getReportAuditTrail, getReportAccessLogs } = useAuditLogs();
  const [filters, setFilters] = useState({
    entity_type: '',
    action_type: '',
    date_from: '',
    date_to: '',
    search: ''
  });
  const [reportAuditTrail, setReportAuditTrail] = useState<any[]>([]);
  const [reportAccessLogs, setReportAccessLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (reportId) {
      loadReportSpecificLogs();
      setActiveTab('changes');
    } else {
      fetchAuditLogs({ limit: 100 });
    }
  }, [reportId]);

  const loadReportSpecificLogs = async () => {
    if (!reportId) return;
    
    const [auditTrail, accessLogs] = await Promise.all([
      getReportAuditTrail(reportId),
      getReportAccessLogs(reportId)
    ]);
    
    setReportAuditTrail(auditTrail);
    setReportAccessLogs(accessLogs);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const filterParams: any = {};
    if (filters.entity_type) filterParams.entity_type = filters.entity_type;
    if (filters.action_type) filterParams.action_type = filters.action_type;
    if (filters.date_from) filterParams.date_from = filters.date_from;
    if (filters.date_to) filterParams.date_to = filters.date_to;
    
    fetchAuditLogs(filterParams);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return <Activity className="h-4 w-4" />;
      case 'update': return <Activity className="h-4 w-4" />;
      case 'view': 
      case 'access': return <Eye className="h-4 w-4" />;
      case 'delete': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const exportLogs = () => {
    const dataToExport = reportId ? reportAuditTrail : auditLogs;
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,Action,Entity,Actor,Details\n" +
      dataToExport.map(log => 
        `${log.created_at || log.audit_log?.timestamp},${log.action_type || log.audit_log?.action_type},${log.entity_type || log.audit_log?.entity_type},${log.actor_id || log.audit_log?.actor_id || 'System'},${log.field_changed || log.access_type || 'N/A'}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        log.entity_type.toLowerCase().includes(searchLower) ||
        log.action_type.toLowerCase().includes(searchLower) ||
        (log.metadata && JSON.stringify(log.metadata).toLowerCase().includes(searchLower))
      );
    }
    return true;
  });

  return (
    <Card className={`bg-gray-800/50 border-gray-700/50 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Shield className="h-5 w-5 text-blue-400" />
            <span>{reportId ? 'Report Audit Trail' : 'System Audit Logs'}</span>
          </CardTitle>
          <Button 
            onClick={exportLogs} 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {!reportId && (
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search logs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              
              <Select value={filters.entity_type} onValueChange={(value) => handleFilterChange('entity_type', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Entity Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="">All Entities</SelectItem>
                  <SelectItem value="report">Reports</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="assignment">Assignments</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filters.action_type} onValueChange={(value) => handleFilterChange('action_type', value)}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="">All Actions</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
              
              <Button onClick={applyFilters} className="bg-blue-600 hover:bg-blue-700">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="datetime-local"
                placeholder="From Date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Input
                type="datetime-local"
                placeholder="To Date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-700">
            {!reportId && <TabsTrigger value="all">All Logs</TabsTrigger>}
            {reportId && (
              <>
                <TabsTrigger value="changes">Changes</TabsTrigger>
                <TabsTrigger value="access">Access History</TabsTrigger>
              </>
            )}
          </TabsList>

          {!reportId && (
            <TabsContent value="all" className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading audit logs...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredLogs.map((log) => (
                    <div key={log.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          {getActionIcon(log.action_type)}
                          <span className="text-white font-semibold capitalize">
                            {log.action_type} {log.entity_type}
                          </span>
                          <Badge className={`${getSeverityColor(log.severity_level)} text-white`}>
                            {log.severity_level}
                          </Badge>
                          {log.is_sensitive && (
                            <Badge className="bg-red-500 text-white">Sensitive</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Actor:</span>
                          <span className="text-white ml-2">
                            {log.actor_id ? `User ${log.actor_id.slice(0, 8)}` : log.actor_type}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Entity ID:</span>
                          <span className="text-white ml-2 font-mono">{log.entity_id.slice(0, 8)}</span>
                        </div>
                        {log.ip_address && (
                          <div>
                            <span className="text-gray-400">IP Address:</span>
                            <span className="text-white ml-2">{log.ip_address}</span>
                          </div>
                        )}
                        {log.access_method && (
                          <div>
                            <span className="text-gray-400">Access Method:</span>
                            <span className="text-white ml-2 capitalize">{log.access_method}</span>
                          </div>
                        )}
                      </div>
                      
                      {log.metadata && (
                        <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs">
                          <span className="text-gray-400">Metadata:</span>
                          <pre className="text-gray-300 mt-1 whitespace-pre-wrap">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          )}

          {reportId && (
            <TabsContent value="changes" className="space-y-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {reportAuditTrail.map((change) => (
                  <div key={change.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Activity className="h-4 w-4 text-orange-400" />
                        <span className="text-white font-semibold">
                          {change.field_changed} Changed
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(change.created_at), 'MMM dd, yyyy HH:mm:ss')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Previous Value:</span>
                        <div className="text-red-300 bg-red-900/20 p-2 rounded mt-1">
                          {change.previous_value || 'None'}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">New Value:</span>
                        <div className="text-green-300 bg-green-900/20 p-2 rounded mt-1">
                          {change.new_value || 'None'}
                        </div>
                      </div>
                    </div>
                    
                    {change.change_reason && (
                      <div className="mt-2">
                        <span className="text-gray-400">Reason:</span>
                        <span className="text-white ml-2">{change.change_reason}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          {reportId && (
            <TabsContent value="access" className="space-y-4">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {reportAccessLogs.map((access) => (
                  <div key={access.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <Eye className="h-4 w-4 text-blue-400" />
                        <span className="text-white font-semibold capitalize">
                          {access.access_type} Access
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{format(new Date(access.created_at), 'MMM dd, yyyy HH:mm:ss')}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">User:</span>
                        <span className="text-white ml-2">
                          {access.audit_log?.actor_id ? 
                            `User ${access.audit_log.actor_id.slice(0, 8)}` : 
                            'Anonymous'
                          }
                        </span>
                      </div>
                      {access.duration_seconds && (
                        <div>
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white ml-2">{access.duration_seconds}s</span>
                        </div>
                      )}
                      {access.purpose && (
                        <div>
                          <span className="text-gray-400">Purpose:</span>
                          <span className="text-white ml-2">{access.purpose}</span>
                        </div>
                      )}
                    </div>
                    
                    {access.accessed_sections && (
                      <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs">
                        <span className="text-gray-400">Sections Accessed:</span>
                        <pre className="text-gray-300 mt-1">
                          {JSON.stringify(access.accessed_sections, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AuditLogViewer;
