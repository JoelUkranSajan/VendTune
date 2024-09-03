import { useMapEvents } from "react-leaflet";

const MapClickHandler = ({ onClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log("Clicked coordinates:", lat, lng);
      onClick({ lat, lng });
    }
  });

  return null;
};

export default MapClickHandler;
