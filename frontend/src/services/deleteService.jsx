import api from '../api';

const deleteService = async (id) => {
  const response = await api.delete(`/api/services/${id}`);
  return response.data;
};

export default deleteService;
