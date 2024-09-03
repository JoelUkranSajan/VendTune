import api from '../api';

const putVendor = async (id, updatedData) => {
  try {
    console.log(updatedData)

    const response = await api.put(`/api/vendors/${id}/`, updatedData);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error updating business unit:', error);
    throw error;
  }
};

export default putVendor;
