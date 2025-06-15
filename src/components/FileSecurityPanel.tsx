
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Scan, CheckCircle, AlertTriangle, Clock, Download, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FileSecurityPanelProps {
  fileUrl: string;
  reportId: string;
  fileType: string;
  onScanComplete?: (result: any) => void;
  showActions?: boolean;
}

const FileSecurityPanel = ({ 
  fileUrl, 
  reportId, 
  fileType, 
  onScanComplete,
  showActions = true 
}: FileSecurityPanelProps) => {
  const [scanStatus, setScanStatus] = useState<any>(null);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkScanStatus();
  }, [fileUrl]);

  const checkScanStatus = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('file_scan_logs')
        .select('*')
        .eq('file_url', fileUrl)
        .order('scan_timestamp', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setScanStatus(data);
    } catch (error: any) {
      console.error('Error checking scan status:', error);
    } finally {
      setLoading(false);
    }
  };

  const performScan = async () => {
    try {
      setScanning(true);
      
      const { data, error } = await supabase.functions.invoke('scan-file', {
        body: {
          fileUrl,
          reportId,
          fileType
        }
      });

      if (error) throw error;

      setScanStatus({
        scan_result: data.scanResult,
        threats_detected: data.threats || [],
        scan_timestamp: new Date().toISOString(),
        scan_details: data.scanDetails
      });

      toast({
        title: data.scanResult === 'clean' ? "File is safe" : "Scan completed",
        description: data.message,
        variant: data.scanResult === 'clean' ? "default" : "destructive",
      });

      if (onScanComplete) {
        onScanComplete(data);
      }
    } catch (error: any) {
      console.error('Error scanning file:', error);
      toast({
        title: "Scan failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  const getScanStatusBadge = () => {
    if (loading) {
      return (
        <Badge className="bg-gray-600 text-white">
          <Clock className="w-3 h-3 mr-1 animate-spin" />
          Checking...
        </Badge>
      );
    }

    if (!scanStatus) {
      return (
        <Badge className="bg-yellow-600 text-white">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Not Scanned
        </Badge>
      );
    }

    switch (scanStatus.scan_result) {
      case 'clean':
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Safe
          </Badge>
        );
      case 'infected':
        return (
          <Badge className="bg-red-600 text-white animate-pulse">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Virus Detected
          </Badge>
        );
      case 'suspicious':
        return (
          <Badge className="bg-orange-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Suspicious
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-blue-600 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Scanning...
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-600 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const canViewFile = () => {
    return scanStatus && scanStatus.scan_result === 'clean';
  };

  const hasThreats = () => {
    return scanStatus && ['infected', 'suspicious'].includes(scanStatus.scan_result);
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="text-white font-medium">File Security Status</span>
        </div>
        {getScanStatusBadge()}
      </div>

      {scanStatus && hasThreats() && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium">Security Threat Detected</span>
          </div>
          {scanStatus.threats_detected?.length > 0 && (
            <div>
              <p className="text-red-300 text-sm mb-1">Detected threats:</p>
              <ul className="text-red-300 text-sm list-disc list-inside">
                {scanStatus.threats_detected.map((threat: string, index: number) => (
                  <li key={index}>{threat}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-red-300 text-sm mt-2">
            ⚠️ This file cannot be viewed or downloaded for security reasons.
          </p>
        </div>
      )}

      {scanStatus && canViewFile() && (
        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3 mb-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">File is safe to view and download</span>
          </div>
          <p className="text-green-300 text-sm mt-1">
            Last scanned: {new Date(scanStatus.scan_timestamp).toLocaleString()}
          </p>
        </div>
      )}

      {showActions && (
        <div className="flex items-center space-x-2">
          {!scanStatus && (
            <Button
              size="sm"
              onClick={performScan}
              disabled={scanning}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {scanning ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  Scanning...
                </>
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Scan File
                </>
              )}
            </Button>
          )}

          {scanStatus && (
            <Button
              size="sm"
              variant="outline"
              onClick={performScan}
              disabled={scanning}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              {scanning ? (
                <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full" />
              ) : (
                <>
                  <Scan className="w-4 h-4 mr-2" />
                  Re-scan
                </>
              )}
            </Button>
          )}

          {canViewFile() && (fileType.includes('image') || fileType.includes('video')) && (
            <Button
              size="sm"
              variant="outline"
              className="border-green-500 text-green-300 hover:bg-green-600/20"
            >
              <Eye className="w-4 h-4 mr-2" />
              Safe to View
            </Button>
          )}

          {canViewFile() && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(fileUrl, '_blank')}
              className="border-blue-500 text-blue-300 hover:bg-blue-600/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Safe to Download
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileSecurityPanel;
