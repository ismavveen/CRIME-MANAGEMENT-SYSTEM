
export interface FormData {
  // Basic info
  wantsToReport?: boolean;
  crimeType: string;
  crimeDetails?: string;
  isEmergency?: boolean;
  
  // Location
  location: {
    state: string;
    lga?: string;
    specificArea?: string;
  };
  
  // Time
  incidentTime: {
    when: 'specific' | 'today' | 'yesterday' | 'lastWeek' | 'lastMonth' | 'notSure';
    date?: string;
    time?: string;
  };
  
  // Safety information
  safety: {
    criminalPresent: string;
    currentlySafe?: boolean;
  };
  
  // Description
  description: string;
  witnessInfo?: string;
  
  // Evidence
  evidence: {
    hasEvidence: boolean;
    files: File[];
  };
  
  // Contact
  contact: {
    isAnonymous: boolean;
    contactInfo?: string;
  };
  
  // Reporting method
  reportingMethod: 'text' | 'voice';
  
  // Emergency location (optional)
  emergencyLocation?: {
    latitude: number;
    longitude: number;
    timestamp: string;
    accuracy?: number;
  };
}
