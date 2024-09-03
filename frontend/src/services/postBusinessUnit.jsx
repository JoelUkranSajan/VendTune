import api from "../api";

export const postBusinessUnit = async (newBusinessUnit) => {
  const { unit_name, permit_id, permit_expiry_date, unit_type } = newBusinessUnit;

  const cleanedBusinessUnit = {
    unit_name,
    permit_id,
    permit_expiry_date,
    unit_type,
  };

  try {
    const response = await api.post('/api/business_units/', cleanedBusinessUnit);
    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error adding business unit:', error);
    throw error;
  }
};

export default postBusinessUnit