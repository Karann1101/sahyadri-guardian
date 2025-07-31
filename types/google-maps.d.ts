declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class StreetViewPanorama {
      constructor(
        container: HTMLElement,
        opts?: StreetViewPanoramaOptions
      );
      getStatus(): StreetViewStatus;
      setPosition(position: LatLng | LatLngLiteral): void;
      setPov(pov: StreetViewPov): void;
      setZoom(zoom: number): void;
    }

    interface StreetViewPanoramaOptions {
      position?: LatLng | LatLngLiteral;
      pov?: StreetViewPov;
      zoom?: number;
      addressControl?: boolean;
      fullscreenControl?: boolean;
      motionTracking?: boolean;
      motionTrackingControl?: boolean;
      showRoadLabels?: boolean;
      visible?: boolean;
      zoomControl?: boolean;
      linksControl?: boolean;
      panControl?: boolean;
      enableCloseButton?: boolean;
      clickToGo?: boolean;
      scrollwheel?: boolean;
      draggable?: boolean;
      keyboardShortcuts?: boolean;
      streetViewControl?: boolean;
    }

    interface StreetViewPov {
      heading: number;
      pitch: number;
    }

    interface LatLng {
      lat(): number;
      lng(): number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    enum StreetViewStatus {
      OK = 'OK',
      ZERO_RESULTS = 'ZERO_RESULTS',
      UNKNOWN_ERROR = 'UNKNOWN_ERROR'
    }

    namespace event {
      function addListener(
        instance: any,
        eventName: string,
        handler: Function
      ): void;
    }
  }
}

export {}; 