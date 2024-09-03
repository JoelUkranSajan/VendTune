import api from "../api";
import { ACCESS_TOKEN } from "../constants"
import { REFRESH_TOKEN } from "../constants"

export const login = async (email, password) => {
  const route = "/login/";
  try {
    const response = await api.post(route, { 
      "business_email": email, 
      "password": password });
    localStorage.setItem(ACCESS_TOKEN, response.data.access);
    localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
    return response;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
