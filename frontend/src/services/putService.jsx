import api from '../api';

const putService = async (id, data) => {
  try {
    console.log(data)
    const response = await api.put(`/api/services/${id}/`, data);
    console.log(response)
    return response.data;
  } catch (error) {
    throw new Error('Failed to update service');
  }
};

export default putService;
