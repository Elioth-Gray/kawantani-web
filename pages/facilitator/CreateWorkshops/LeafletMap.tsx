import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({
  lat,
  lng,
  onLocationChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Add marker
    const marker = L.marker([lat, lng], {
      draggable: true,
    }).addTo(map);

    marker.bindPopup('Lokasi Workshop').openPopup();

    // Handle marker drag
    marker.on('dragend', (e: L.LeafletEvent) => {
      const position = (e.target as L.Marker).getLatLng();
      onLocationChange(position.lat, position.lng);
    });

    // Handle map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng([clickLat, clickLng]);
      onLocationChange(clickLat, clickLng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // Empty dependency array - only initialize once

  // Update marker position when props change
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLatLng = L.latLng(lat, lng);
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(
        newLatLng,
        mapInstanceRef.current.getZoom(),
      );
    }
  }, [lat, lng]);

  return (
    <div
      ref={mapRef}
      className='w-full h-[400px] rounded-lg border border-gray-600'
      style={{ zIndex: 1 }}
    />
  );
};

export default LeafletMap;
