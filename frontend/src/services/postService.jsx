import api from '../api';

const postService = async (formData) => {
  try {
    console.log("Sending data to API:", formData);
    const response = await api.post("/api/services/", formData);
    if (response.status === 201) {
      return response.data;
    } else {
      console.error("Error creating service:", response.status, response.data);
      return null;
    }
  } catch (error) {
    console.error("Error creating service:", error.response ? error.response.data : error.message);
    return null;
  }
};

export default postService;
