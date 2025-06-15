
/**
 * File Scan Metrics Component
 * Displays security metrics in a clean, modular way
 * Implements responsive design and accessibility features
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { FileScanLog, ReportFile } from './FileScanService';

interface FileScanMetricsProps {
  reportFiles: ReportFile[];
  scanLogs: FileScanLog[];
  className?: string;
}

/**
 * Displays file security metrics with proper data validation
 */
const FileScanMetrics = ({ reportFiles, scanLogs, className = '' }: FileScanMetricsProps) => {
  // Calculate metrics with safe array operations
  const totalFiles = reportFiles?.length || 0;
  const scannedFiles = scanLogs?.length || 0;
  const cleanFiles = scanLogs?.filter(log => log?.scan_result === 'clean')?.length || 0;
  const threatsDetected = scanLogs?.filter(log => 
    log?.scan_result && ['infected', 'suspicious'].includes(log.scan_result)
  )?.length || 0;

  return (
    <Card className={`bg-gray-800/50 border-gray-700/50 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Shield className="h-6 w-6 text-cyan-400" />
          <span>File Security Dashboard</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 p-4 rounded-lg" role="region" aria-label="Total Files">
            <h3 className="text-white font-semibold">Total Files</h3>
            <p className="text-2xl font-bold text-cyan-400" aria-live="polite">
              {totalFiles.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg" role="region" aria-label="Scanned Files">
            <h3 className="text-white font-semibold">Scanned Files</h3>
            <p className="text-2xl font-bold text-green-400" aria-live="polite">
              {scannedFiles.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg" role="region" aria-label="Clean Files">
            <h3 className="text-white font-semibold">Clean Files</h3>
            <p className="text-2xl font-bold text-green-400" aria-live="polite">
              {cleanFiles.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-700/30 p-4 rounded-lg" role="region" aria-label="Threats Detected">
            <h3 className="text-white font-semibold">Threats Detected</h3>
            <p className="text-2xl font-bold text-red-400" aria-live="polite">
              {threatsDetected.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileScanMetrics;
