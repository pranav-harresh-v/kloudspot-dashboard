import axios from "axios";

const API_URL = "https://hiring-dev.internal.kloudspot.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response, // Pass successful requests through
  (error) => {
    // Check if error is 401 (Unauthorized)
    if (error.response?.status === 403) {
      console.warn("Session expired. Logging out...");

      // 1. Clear the bad token
      localStorage.removeItem("token");

      // 2. Force redirect to Login
      // We use window.location because we can't use useNavigate inside a JS file
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
// ----------------------

export const getSites = async () => {
  const response = await api.get("/sites");
  return response.data;
};

// LOGIN FUNCTION
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email: email, // Fixed: API expects 'username' based on your Postman test
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAnalyticsBody = (start, end, siteId) => ({
  siteId: siteId,
  fromUtc: start,
  toUtc: end,
});

export const getOccupancy = (start, end, siteId) =>
  api.post("/analytics/occupancy", getAnalyticsBody(start, end, siteId));

export const getFootfall = (start, end, siteId) =>
  api.post("/analytics/footfall", getAnalyticsBody(start, end, siteId));

export const getDwellTime = (start, end, siteId) =>
  api.post("/analytics/dwell", getAnalyticsBody(start, end, siteId));

export const getDemographics = (start, end, siteId) =>
  api.post("/analytics/demographics", getAnalyticsBody(start, end, siteId));

export const getEntries = (start, end, siteId, page = 1, pageSize = 10) => {
  return api.post("/analytics/entry-exit", {
    siteId: siteId,
    fromUtc: start,
    toUtc: end,
    pageNumber: page, // <--- CHANGED from 'page' to 'pageNumber'
    pageSize: pageSize, // <--- CHANGED from 'limit' to 'pageSize'
  });
};

export const startSimulation = () => api.get("/sim/start");

export default api;
