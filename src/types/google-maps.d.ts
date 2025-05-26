
declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions);
      setCenter(latlng: LatLng): void;
      setZoom(zoom: number): void;
      addListener(event: string, handler: Function): void;
    }
    
    class Marker {
      constructor(options?: MarkerOptions);
      setMap(map: Map | null): void;
      addListener(event: string, handler: Function): void;
      setPosition(latlng: LatLng): void;
      setIcon(icon: string | Icon): void;
    }
    
    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      open(map?: Map, anchor?: Marker): void;
      close(): void;
      setContent(content: string): void;
    }
    
    class Size {
      constructor(width: number, height: number);
    }
    
    class Icon {
      url: string;
      size?: Size;
      scaledSize?: Size;
      origin?: Point;
      anchor?: Point;
    }
    
    class Point {
      constructor(x: number, y: number);
    }
    
    interface MapOptions {
      center: LatLng;
      zoom: number;
      mapTypeId?: string;
    }
    
    interface MarkerOptions {
      position: LatLng;
      map?: Map;
      title?: string;
      icon?: string | Icon;
    }
    
    interface InfoWindowOptions {
      content?: string;
    }
    
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }
    
    enum MapTypeId {
      ROADMAP = 'roadmap',
      SATELLITE = 'satellite',
      HYBRID = 'hybrid',
      TERRAIN = 'terrain'
    }
  }
  
  namespace maps.visualization {
    class HeatmapLayer {
      constructor(options?: HeatmapLayerOptions);
      setMap(map: google.maps.Map | null): void;
      setData(data: google.maps.LatLng[] | google.maps.visualization.WeightedLocation[]): void;
    }
    
    interface HeatmapLayerOptions {
      data: google.maps.LatLng[] | google.maps.visualization.WeightedLocation[];
      map?: google.maps.Map;
    }
    
    interface WeightedLocation {
      location: google.maps.LatLng;
      weight: number;
    }
  }
}

export {};
