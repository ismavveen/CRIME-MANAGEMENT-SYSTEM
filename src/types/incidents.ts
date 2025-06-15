
export interface MapIncident {
  id: string;
  lat: number;
  lng: number;
  type: 'critical' | 'warning' | 'resolved' | 'assigned';
  title: string;
  time: string;
  isAssigned: boolean;
}

export interface DetailedIncident {
  id: string;
  type: string;
  location: string;
  status: 'critical' | 'warning' | 'resolved' | 'investigating';
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  officer: string;
  description?: string;
  state?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  updates?: {
    time: string;
    message: string;
    author: string;
  }[];
}
