import React, { useEffect, useRef, useState } from 'react';

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
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    // Dynamic import of Leaflet to avoid SSR issues
    const initializeMap = async () => {
      const L = await import('leaflet');

      // Load Leaflet CSS dynamically
      if (!document.querySelector('link[href*="leaflet"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        link.integrity =
          'sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==';
        link.crossOrigin = '';
        document.head.appendChild(link);
      }

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

      // Initialize map
      const map = L.map(mapRef.current!).setView([lat, lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      // Add marker
      const marker = L.marker([lat, lng], {
        draggable: true,
      }).addTo(map);

      marker.bindPopup('Lokasi Workshop').openPopup();

      // Handle marker drag
      marker.on('dragend', (e: any) => {
        const position = e.target.getLatLng();
        onLocationChange(position.lat, position.lng);
      });

      // Handle map click
      map.on('click', (e: any) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        marker.setLatLng([clickLat, clickLng]);
        onLocationChange(clickLat, clickLng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    };

    initializeMap().catch(console.error);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
  }, [isClient, lat, lng, onLocationChange]);

  // Update marker position when props change
  useEffect(() => {
    if (!isClient || !mapInstanceRef.current || !markerRef.current) return;

    const updateMarker = async () => {
      const L = await import('leaflet');
      const newLatLng = L.latLng(lat, lng);
      markerRef.current.setLatLng(newLatLng);
      mapInstanceRef.current.setView(
        newLatLng,
        mapInstanceRef.current.getZoom(),
      );
    };

    updateMarker().catch(console.error);
  }, [isClient, lat, lng]);

  if (!isClient) {
    return (
      <div className='w-full h-[400px] rounded-lg border border-gray-600 flex items-center justify-center bg-gray-100'>
        <div className='text-gray-600'>Loading map...</div>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      className='w-full h-[400px] rounded-lg border border-gray-600'
      style={{ zIndex: 1 }}
    />
  );
};

export default LeafletMap;
