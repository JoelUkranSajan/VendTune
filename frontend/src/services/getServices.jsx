import api from "../api";

function createData(
  id,
  business,
  date,
  time,
  unit,
  vendors,
  address,
  service_id,
  location,
  vendors_id,
  revenue
) {
  return {
    id,
    business,
    date,
    time,
    unit,
    vendors,
    address,
    service_id,
    location,
    vendors_id,
    revenue
  };
}

const fetchBusinessUnits = async (
  setPastRows,
  setPresentRows,
  setLoading,
  setError
) => {
  setLoading(true);
  try {
    const response = await api.get("/api/services/");
    const data = response.data;
    const today = new Date();
    const pastServices = [];
    const presentServices = [];

    data.forEach((item, index) => {
      const serviceDate = new Date(item.service_date);
      const endTime = new Date(`${item.service_date}T${item.service_end_time}`);
      const vendors = item.service_vendors
        .map((vendor) => `${vendor.vendor_name}`)
        .join(", ");

      const vendors_id = item.service_vendors
      .map((vendor) => `${vendor.vendor}`);

      const row = createData(
        index + 1,
        `${item.business}`,
        serviceDate.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        `${item.service_start_time} - ${item.service_end_time}`,
        `${item.unit}`,
        vendors,
        item.location_address,
        item.service_id,
        item.location_coords,
        vendors_id,
        item.revenue
      );

      if (
        serviceDate < today ||
        (serviceDate.toDateString() === today.toDateString() && endTime < today)
      ) {
        pastServices.push(row);
      } else {
        presentServices.push(row);
      }
    });

    setPastRows(pastServices);
    setPresentRows(presentServices);
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export default fetchBusinessUnits;
