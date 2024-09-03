import api from '../api';

const getBusinessUnits = async () => {
  try {
    const response = await api.get('/api/business_units/');
    console.log(response)
    const formattedData = response.data.map((item, index) => ({
      id: index + 1,
      business: item.business,
      unit_name: item.unit_name,
      permit_id: item.permit_id,
      permit_expiry_date: item.permit_expiry_date,
      unit_type: item.unit_type,
    }));
    return formattedData;
  } catch (error) {
    console.error('Error fetching business units:', error);
    return [];
  }
};

export default getBusinessUnits;
