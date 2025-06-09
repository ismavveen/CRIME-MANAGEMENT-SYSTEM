
export interface FormData {
  // Basic info
  crimeType: string;
  crimeDetails?: string;
  
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
}
