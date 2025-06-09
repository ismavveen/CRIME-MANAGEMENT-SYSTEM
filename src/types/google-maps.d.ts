
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
        LatLng: new (lat: number, lng: number) => google.maps.LatLng;
        Marker: new (options: google.maps.MarkerOptions) => google.maps.Marker;
        SymbolPath: {
          CIRCLE: number;
          FORWARD_CLOSED_ARROW: number;
          FORWARD_OPEN_ARROW: number;
          BACKWARD_CLOSED_ARROW: number;
          BACKWARD_OPEN_ARROW: number;
        };
        visualization: {
          HeatmapLayer: new (options: google.maps.visualization.HeatmapLayerOptions) => google.maps.visualization.HeatmapLayer;
        };
      };
    };
  }
}

declare namespace google.maps {
  interface MapOptions {
    zoom: number;
    center: LatLngLiteral;
    mapTypeId?: string;
    styles?: MapTypeStyle[];
  }

  interface MapTypeStyle {
    featureType?: string;
    elementType?: string;
    stylers?: Array<{ [key: string]: any }>;
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map | null;
    title?: string;
    icon?: string | Icon | Symbol;
  }

  interface Icon {
    url: string;
    size?: Size;
    origin?: Point;
    anchor?: Point;
    scaledSize?: Size;
  }

  interface Symbol {
    path: number | string;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeWeight?: number;
    strokeColor?: string;
  }

  interface Size {
    width: number;
    height: number;
  }

  interface Point {
    x: number;
    y: number;
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface LatLng {
    lat(): number;
    lng(): number;
  }

  interface Map {
    setCenter(latlng: LatLng | LatLngLiteral): void;
    setZoom(zoom: number): void;
  }

  interface Marker {
    setMap(map: Map | null): void;
    addListener(event: string, handler: () => void): void;
  }

  namespace visualization {
    interface WeightedLocation {
      location: LatLng;
      weight: number;
    }

    interface HeatmapLayerOptions {
      data: WeightedLocation[];
      map: Map | null;
      radius?: number;
      opacity?: number;
      gradient?: string[];
    }

    interface HeatmapLayer {
      setMap(map: Map | null): void;
      setOptions(options: Partial<HeatmapLayerOptions>): void;
    }
  }
}

export {};
