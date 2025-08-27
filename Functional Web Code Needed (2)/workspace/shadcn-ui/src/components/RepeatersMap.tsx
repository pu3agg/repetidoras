import React, { useEffect, useRef } from 'react';
import { Repeater } from '@/types';

declare global {
  interface Window {
    L: {
      map: (element: HTMLDivElement) => LeafletMap;
      tileLayer: (url: string, options: object) => LeafletTileLayer;
      marker: (coords: [number, number]) => LeafletMarker;
    };
  }
}

interface LeafletMap {
  setView: (coords: [number, number], zoom: number) => LeafletMap;
  removeLayer: (layer: LeafletMarker) => void;
}

interface LeafletTileLayer {
  addTo: (map: LeafletMap) => void;
}

interface LeafletMarker {
  addTo: (map: LeafletMap) => LeafletMarker;
  bindPopup: (content: string) => LeafletMarker;
  on: (event: string, callback: () => void) => void;
}

interface RepeatersMapProps {
  repeaters: Repeater[];
  selectedRepeater?: Repeater | null;
  onRepeaterSelect?: (repeater: Repeater) => void;
}

const RepeatersMap: React.FC<RepeatersMapProps> = ({ 
  repeaters, 
  selectedRepeater, 
  onRepeaterSelect 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = window.L.map(mapRef.current).setView([-15.7942, -47.8822], 4); // Center of Brazil

      // Add tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add markers for repeaters (only those with valid coordinates)
    repeaters.forEach(repeater => {
      // Skip repeaters with no coordinates (0,0)
      if (repeater.latitude === 0 && repeater.longitude === 0) return;
      
      const marker = window.L.marker([repeater.latitude, repeater.longitude])
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div class="p-2">
            <h3 class="font-bold text-lg">${repeater.callsign}</h3>
            <p><strong>Frequência:</strong> ${repeater.frequency} MHz</p>
            <p><strong>Offset:</strong> ${repeater.offset} MHz</p>
            <p><strong>CTCSS:</strong> ${repeater.ctcss} Hz</p>
            <p><strong>Local:</strong> ${repeater.location}</p>
            <p><strong>Status:</strong> <span class="badge ${repeater.status === 'Ativa' ? 'bg-green-500' : repeater.status === 'Inativa' ? 'bg-red-500' : 'bg-yellow-500'} text-white px-2 py-1 rounded">${repeater.status}</span></p>
            <p><strong>Proprietário:</strong> ${repeater.owner}</p>
            ${repeater.notes ? `<p><strong>Observações:</strong> ${repeater.notes}</p>` : ''}
          </div>
        `);

      if (onRepeaterSelect) {
        marker.on('click', () => {
          onRepeaterSelect(repeater);
        });
      }

      markersRef.current.push(marker);
    });

    // Focus on selected repeater
    if (selectedRepeater) {
      mapInstanceRef.current.setView([selectedRepeater.latitude, selectedRepeater.longitude], 10);
    }

    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
      }
    };
  }, [repeaters, selectedRepeater, onRepeaterSelect]);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Mapa das Repetidoras</h2>
        <p className="text-gray-600">Clique nos marcadores para ver detalhes</p>
      </div>
      <div ref={mapRef} className="h-96 w-full rounded-b-lg"></div>
    </div>
  );
};

export default RepeatersMap;