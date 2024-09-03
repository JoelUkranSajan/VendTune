import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ServicesMap = ({ coordinates }) => {
  const mapRef = useRef(null);
  useEffect(() => {
    if (mapRef.current && coordinates.length > 0) {
      const map = mapRef.current;
      const bounds = coordinates.map(coord => [coord.lat, coord.lng]);
      map.fitBounds(bounds);
    }
  }, [coordinates]);

  return (
    <MapContainer
      center={[40.7900, -73.9500]}
      zoom={11}
      style={{ height: "100%", width: "100%" }}
      whenCreated={(mapInstance) => { mapRef.current = mapInstance }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinates.map((coord, index) => (
        <Marker key={index} position={[coord.lat, coord.lng]}>
          <Popup>
            {coord.businessUnit}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default ServicesMap;