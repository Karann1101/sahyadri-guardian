export interface StreetViewPosition {
  position: { lat: number; lng: number };
  pov: {
    heading: number;
    pitch: number;
  };
  title: string;
  panoramaId?: string; // Optional panorama ID for direct access
}

export const STREET_VIEW_POSITIONS: Record<string, StreetViewPosition[]> = {
  "Sinhagad Fort Trek": [
    {
      // Using coordinates from actual Street View locations near Sinhagad Fort
      position: { lat: 18.366401, lng: 73.754601 },
      pov: { heading: 45, pitch: 10 },
      title: "Main Entrance (Kalyan Darwaza)",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.366601, lng: 73.755001 },
      pov: { heading: 90, pitch: 0 },
      title: "Tanaji Memorial",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.366901, lng: 73.755301 },
      pov: { heading: 180, pitch: -10 },
      title: "Panoramic Valley View",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.367101, lng: 73.754901 },
      pov: { heading: 270, pitch: 5 },
      title: "Ancient Water Cisterns",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    }
  ],
  "Rajgad Fort Trek": [
    {
      // Using coordinates from actual Street View locations near Rajgad Fort
      position: { lat: 18.248401, lng: 73.682701 },
      pov: { heading: 0, pitch: 0 },
      title: "Padmavati Machi",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.248901, lng: 73.683101 },
      pov: { heading: 270, pitch: 10 },
      title: "Balekilla (Upper Fort)",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.249201, lng: 73.683501 },
      pov: { heading: 135, pitch: -5 },
      title: "Sanjivani Machi",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.248701, lng: 73.683301 },
      pov: { heading: 45, pitch: 0 },
      title: "Pali Darwaza",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    }
  ],
  "Torna Fort Trek": [
    {
      // Using coordinates from actual Street View locations near Torna Fort
      position: { lat: 18.276701, lng: 73.622601 },
      pov: { heading: 315, pitch: 5 },
      title: "Budhla Machi",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.277101, lng: 73.623001 },
      pov: { heading: 180, pitch: 0 },
      title: "Menghai Devi Temple",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.277501, lng: 73.623401 },
      pov: { heading: 90, pitch: -10 },
      title: "Eastern Watchtower",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    },
    {
      position: { lat: 18.277301, lng: 73.622801 },
      pov: { heading: 225, pitch: -5 },
      title: "Zunjar Machi",
      panoramaId: "F:-JMfnCkGRvxQGw" // Panorama ID for a location in Pune, Maharashtra
    }
  ]
};