import api from '../api';

const getVendors = async () => {
  try {
    const response = await api.get('/api/vendors/');
    const formattedData = response.data.map((item, index) => ({
      id: index + 1,
      business: item.business,
      vendor_name: item.vendor_name,
      licence_id: item.licence_id,
      licence_expiry_date: item.licence_expiry_date,
      vendor_email: item.vendor_email,
      vendor_phone_number: item.vendor_phone_number,
    }));
    return formattedData;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
};

export default getVendors;
