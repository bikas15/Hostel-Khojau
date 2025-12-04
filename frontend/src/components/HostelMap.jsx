import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HostelMap = ({ hostels, onHostelSelect, selectedHostel }) => {
  const [center, setCenter] = useState([27.7172, 85.3240]);

  useEffect(() => {
    if (hostels && hostels.length > 0) {
      // Calculate center based on hostels
      const avgLat = hostels.reduce((sum, hostel) => sum + hostel.coordinates.latitude, 0) / hostels.length;
      const avgLng = hostels.reduce((sum, hostel) => sum + hostel.coordinates.longitude, 0) / hostels.length;
      setCenter([avgLat, avgLng]);
    }
  }, [hostels]);

  // Create custom marker for selected hostel
  const createCustomIcon = (isSelected = false) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        background-color: ${isSelected ? '#ef4444' : '#dc2626'};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">🏠</div>`,
      iconSize: [25, 25],
      iconAnchor: [12, 12]
    });
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {hostels && hostels.map((hostel) => (
          <Marker
            key={hostel._id}
            position={[hostel.coordinates.latitude, hostel.coordinates.longitude]}
            icon={createCustomIcon(selectedHostel?._id === hostel._id)}
            eventHandlers={{
              click: () => onHostelSelect && onHostelSelect(hostel)
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-semibold text-lg mb-2">{hostel.name}</h3>
                <p className="text-sm text-gray-600 mb-1">{hostel.address}</p>
                <p className="text-sm text-gray-600 mb-2">{hostel.location}, {hostel.city}</p>
                <p className="text-sm font-medium text-red-600 mb-1">
                  Rs. {hostel.priceRange.min} - Rs. {hostel.priceRange.max}
                </p>
                <p className="text-xs text-gray-500 mb-3">{hostel.hostelType}</p>
                <button
                  onClick={() => onHostelSelect && onHostelSelect(hostel)}
                  className="w-full bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors"
                >
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default HostelMap;