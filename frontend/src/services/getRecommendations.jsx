import api from "../api";

export const getRecommendations = async (date, start, end, zone, count) => {
  try {
    const route =
      `api/recommendations/?date=${date}&service_start_time=${start}&service_end_time=${end}&zone_id=${zone}&count=${count}`;
    const response = await api.get(route);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
  }
};

export default getRecommendations;
