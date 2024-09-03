import api from "../api";

const getBusynessScores = async (date, start, end) => {
  try {
    const route = `/api/busyness_estimates/?date=${date}&service_start_time=${start}&service_end_time=${end}`;
    const response = await api.get(route);
    return response;
  } catch (error) {
    console.error('Error fetching busyness score:', error);
  }
}

export default getBusynessScores;
