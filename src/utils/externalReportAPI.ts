
// This utility is for external UIs to submit reports to the DHQ system
// It handles file uploads and ensures data consistency

export interface ExternalReportData {
  description: string;
  threatType: string;
  location?: string;
  manualLocation?: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  priority?: 'low' | 'medium' | 'high';
  state: string;
  localGovernment?: string;
  fullAddress?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracy?: number;
  isAnonymous?: boolean;
  reporterName?: string;
  reporterContact?: string;
  reporterPhone?: string;
  reporterEmail?: string;
}

export interface FileData {
  name: string;
  type: string;
  data: ArrayBuffer | Blob;
}

export interface SubmissionResponse {
  success: boolean;
  reportId?: string;
  serialNumber?: string;
  message?: string;
  error?: string;
}

export class ExternalReportAPI {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://ihcrdzkmjbpfsgipphxa.supabase.co/functions/v1') {
    this.baseUrl = baseUrl;
  }

  async submitReport(
    reportData: ExternalReportData, 
    files?: FileData[]
  ): Promise<SubmissionResponse> {
    try {
      const payload = {
        reportData,
        files: files || []
      };

      const response = await fetch(`${this.baseUrl}/submit-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getApiKey()}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit report');
      }

      return result;
    } catch (error) {
      console.error('Error submitting report:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private getApiKey(): string {
    // In production, this should be securely managed
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloY3JkemttamJwZnNnaXBwaHhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyMTI0ODUsImV4cCI6MjA2Mzc4ODQ4NX0.MiLZksPGq4nS0uIRxotCPZuvKoMLZj8VZ4dgqF-OQl4';
  }

  // Utility method to convert File objects to FileData
  static async fileToFileData(file: File): Promise<FileData> {
    const arrayBuffer = await file.arrayBuffer();
    return {
      name: file.name,
      type: file.type,
      data: arrayBuffer
    };
  }

  // Utility method to validate report data
  static validateReportData(data: ExternalReportData): string[] {
    const errors: string[] = [];

    if (!data.description || data.description.trim().length < 10) {
      errors.push('Description must be at least 10 characters long');
    }

    if (!data.threatType || data.threatType.trim().length === 0) {
      errors.push('Threat type is required');
    }

    if (!data.state || data.state.trim().length === 0) {
      errors.push('State is required');
    }

    if (!['low', 'medium', 'high', 'critical'].includes(data.urgency)) {
      errors.push('Invalid urgency level');
    }

    if (!data.isAnonymous) {
      if (!data.reporterName || data.reporterName.trim().length === 0) {
        errors.push('Reporter name is required when not anonymous');
      }
      if (!data.reporterContact || data.reporterContact.trim().length === 0) {
        errors.push('Reporter contact is required when not anonymous');
      }
    }

    return errors;
  }
}

// Example usage for external UIs:
// 
// const api = new ExternalReportAPI();
// 
// const reportData: ExternalReportData = {
//   description: "Suspicious activity observed...",
//   threatType: "Security Threat",
//   state: "Lagos",
//   urgency: "high",
//   isAnonymous: true,
//   // ... other fields
// };
// 
// const files = await Promise.all(
//   selectedFiles.map(file => ExternalReportAPI.fileToFileData(file))
// );
// 
// const result = await api.submitReport(reportData, files);
// if (result.success) {
//   console.log('Report submitted with ID:', result.reportId);
// } else {
//   console.error('Submission failed:', result.error);
// }
