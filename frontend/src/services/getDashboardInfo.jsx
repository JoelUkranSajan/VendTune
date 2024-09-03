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

const getDashboardInfo = async (setServices, setLoading, setError, setAdditionalData) => {
  setLoading(true);
  try {
    const response = await api.get("/api/services/");
    const data = response.data;
    const services = [];
    const revenueData = [];

    let totalRevenue = 0;
    let bestUnit = "";
    let bestVendor = "";
    let maxRevenue = 0;
    let mostProfitableLocation = "";
    let mostProfitableLocationCoords = [];

    data.forEach((item, index) => {
      const serviceDate = new Date(item.service_date);
      const vendors = item.service_vendors.map((vendor) => vendor.vendor_name).join(", ");
      const vendors_id = item.service_vendors.map((vendor) => vendor.vendor);
      const revenue = Math.abs(item.revenue);

      const row = createData(
        index + 1,
        item.business,
        serviceDate.toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        `${item.service_start_time} - ${item.service_end_time}`,
        item.unit,
        vendors,
        item.location_address,
        item.service_id,
        item.location_coords,
        vendors_id,
        revenue
      );

      services.push(row);
      revenueData.push({ date: item.service_date, revenue });
      console.log(item)
      totalRevenue += revenue;
      if (revenue > maxRevenue) {
        maxRevenue = revenue;
        bestUnit = item.unit;
        bestVendor = item.service_vendors[0]?.vendor || "";
        mostProfitableLocation = item.location_address;

        const coords = item.location_coords.match(/POINT \(([^ ]+) ([^ ]+)\)/);
        mostProfitableLocationCoords = coords ? [parseFloat(coords[2]), parseFloat(coords[1])] : [];
      }
    });

    setServices(services);
    setAdditionalData({
      totalRevenue,
      bestUnit,
      bestVendor,
      revenueData,
      mostProfitableLocation,
      mostProfitableLocationCoords
    });
  } catch (error) {
    setError(error);
  } finally {
    setLoading(false);
  }
};

export default getDashboardInfo;
