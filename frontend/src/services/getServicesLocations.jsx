import api from '../api';

const getServicesLocations = async (setCoordinates, setLoading, setError) => {
  setLoading(true);
  try {
    const response = await api.get("/api/services/geojson");
    const data = response.data.features;
    console.log(data)
    const coordinates = data.map((item) => ({
      lat: item.geometry.coordinates[1],
      lng: item.geometry.coordinates[0],
      businessUnit: item.properties.unit,
    }));
    setCoordinates(coordinates);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export default getServicesLocations;

