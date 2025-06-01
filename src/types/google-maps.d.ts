
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: google.maps.MapOptions) => google.maps.Map;
        LatLng: new (lat: number, lng: number) => google.maps.LatLng;
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
    mapTypeId: string;
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
