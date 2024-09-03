import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

const HeatmapLayer = ({ points }) => {
  const map = useMapEvents({});

  useEffect(() => {
    if (points && points.length > 0) {
      const heat = L.heatLayer(points, { radius: 15, blur: 20, maxZoom: 18 }).addTo(map);
      return () => {
        map.removeLayer(heat);
      };
    }
  }, [map, points]);

  return null;
};

const MapClickHandler = ({ csvGeoJsonData, setLayersCleared, setHoverEnabled, handleSelectedZone }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;

      let closestFeature = null;
      let minDistance = Infinity;

      csvGeoJsonData.features.forEach((feature) => {
        const [centerLng, centerLat] = feature.geometry.center_cor;
        const distance = Math.sqrt(Math.pow(lat - centerLat, 2) + Math.pow(lng - centerLng, 2));

        if (distance < minDistance) {
          minDistance = distance;
          closestFeature = feature;
        }
      });

      if (closestFeature) {
        const [centerLng, centerLat] = closestFeature.geometry.center_cor;
        map.setView([centerLat, centerLng], 16);
        handleSelectedZone(closestFeature.geometry.zone_id);
        console.log(`Zone: ${closestFeature.geometry.zone}, Zone ID: ${closestFeature.geometry.zone_id}`);
      }
    },
    zoomend: () => {
      const currentZoom = map.getZoom();
      console.log("Current Zoom Level:", currentZoom);
      if (currentZoom >= 15) {
        setHoverEnabled(false);
        setLayersCleared(true);
      } else {
        setHoverEnabled(true);
        setLayersCleared(false);
      }
    },
  });
  return null;
};

const ZoneClickHandler = ({ selectedZone }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedZone) {
      const [centerLng, centerLat] = selectedZone.geometry.center_cor;
      map.setView([centerLat, centerLng], 18);
    }
  }, [selectedZone, map]);

  return null;
};

const MarkerClickHandler = ({ setSelectedCord, setAddress }) => {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;

      if (map.getZoom() > 15) {
        setSelectedCord({ lat, lng });
      }
    },
  });
  return null;
};

const PlanningMap = ({ initialHeatMapCor, zoneRecommendationData, taxiZoneData, selectedZone, setSelectedCord, initialSelectedCord, handleSelectedZone, onMarkerClick }) => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [layersCleared, setLayersCleared] = useState(false);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const [selectedCord, setSelectedCordState] = useState(initialSelectedCord || null);
  const [address, setAddress] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null); 
  const mapRef = useRef(null);
  console.log(zoneRecommendationData);

  useEffect(() => {
    if (initialHeatMapCor && initialHeatMapCor.length > 0) {
      const heatmapPoints = initialHeatMapCor.map((item) => [
        item.geometry.coordinates[1],
        item.geometry.coordinates[0],
        item.score,
      ]);
      setHeatmapData(heatmapPoints);
    }
  }, [initialHeatMapCor]);

  useEffect(() => {
    if (selectedZone && mapRef.current) {
      const [centerLng, centerLat] = selectedZone.geometry?.center_cor;
      mapRef.current.setView([centerLat, centerLng], 18);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (initialSelectedCord) {
      setSelectedCordState(initialSelectedCord);
    }
  }, [initialSelectedCord]);

  const onEachFeature = (feature, layer) => {
    layer.setStyle({
      color: "#808080",
      dashArray: "",
      fillOpacity: 0.2,
      fillColor: "#808080",
    });

    if (hoverEnabled) {
      layer.on({
        mouseover: (e) => {
          const layer = e.target;
          layer.setStyle({
            color: "#EE6C4D",
            dashArray: "",
            fillOpacity: 0.7,
            fillColor: "#EE6C4D",
          });
        },
        mouseout: (e) => {
          const layer = e.target;
          layer.setStyle({
            color: "#808080",
            dashArray: "",
            fillOpacity: 0.2,
            fillColor: "#808080",
          });
        },
      });
    }
  };

  const center = [40.7831, -73.9712];
  const zoom = 13;

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100%", width: "100%", position: "absolute", zIndex: -1 }}
      whenCreated={handleMapLoad}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {!layersCleared && taxiZoneData && <GeoJSON data={taxiZoneData} onEachFeature={onEachFeature} />}
      {!layersCleared && heatmapData.length > 0 && <HeatmapLayer points={heatmapData} />}
      {taxiZoneData && (
        <MapClickHandler
          csvGeoJsonData={taxiZoneData}
          setLayersCleared={setLayersCleared}
          setHoverEnabled={setHoverEnabled}
          handleSelectedZone={handleSelectedZone}
        />
      )}
      {selectedZone && <ZoneClickHandler selectedZone={selectedZone} />}
      <MarkerClickHandler
        setSelectedCord={(coords) => {
          setSelectedCordState(coords);
          setSelectedCord(coords);
        }}
        setAddress={setAddress}
      />
      {zoneRecommendationData &&
        zoneRecommendationData.length > 0 &&
        zoneRecommendationData.map((item, index) => (
          <Marker
            key={index}
            position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
            eventHandlers={{
              click: () => {
                onMarkerClick(item.properties.street_address);
                setAddress(item.properties.street_address);
                setSelectedCord({
                  lat: item.geometry.coordinates[1], 
                  lng: item.geometry.coordinates[0]
                })
                setSelectedMarker(index); 
              },
            }}
            icon={L.divIcon({
              className: "custom-marker",
              html: `<div style="
                background-color: ${selectedMarker === index ? '#32CD32' : '#FF6347'};
                width: ${selectedMarker === index ? '35px' : '30px'};
                height: ${selectedMarker === index ? '35px' : '30px'};
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-weight: bold;
                box-shadow: ${selectedMarker === index ? '0 0 15px rgba(0,0,0,0.5)' : 'none'};
                transform: ${selectedMarker === index ? 'scale(1.05)' : 'scale(1)'};
              ">${index+1}</div>`,
            })}
          >
            <Popup>
              <div>
                <strong>Address:</strong> {item.properties.street_address}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default PlanningMap;
