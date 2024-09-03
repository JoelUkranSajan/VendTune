import { ACCESS_TOKEN } from "../constants"
import { REFRESH_TOKEN } from "../constants"
import axios from "axios"

export const postRegister = async (username, useremail, password) => {
  const route = "/signup/";

  const isDevelopment = import.meta.env.MODE === 'development'
  const baseURL = isDevelopment ? "https://localhost:8000/" : "https://vendtune.azurewebsites.net/"
  
  const api = axios.create({
    baseURL: baseURL,
})
  try {
    const response = await api.post(route, 
      { 
        "business_name": username, 
        "business_email": useremail, 
        "password": password 
      });
    localStorage.setItem(ACCESS_TOKEN, response.data.access);
    localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
    return response;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export default postRegister;

