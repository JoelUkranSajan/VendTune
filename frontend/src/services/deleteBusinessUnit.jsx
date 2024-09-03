import api from '../api';

const deleteService = async (id) => {
  const response = await api.delete(`/api/business_units/${id}`);
  return response.data;
};

export default deleteService;
