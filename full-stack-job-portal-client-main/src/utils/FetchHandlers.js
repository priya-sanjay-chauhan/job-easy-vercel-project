import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Export the base URL for direct use if needed
export const getBaseUrl = () => BASE_URL;

export const testConnection = async () => {
  try {
    // Test the root endpoint of the server
    // const response = await axios.get("http://52.66.158.80", {
    //   withCredentials: true,
    // });
    const res = await api.get("/health").catch(async () => await api.get("/"));
    console.log("Server connection test:", res.data);
    return true;
  } catch (error) {
    console.error("Server connection error:", error.message);
    return false;
  }
};

export const getAllHandler = async (url) => {
  console.log(
    "Making request to:",
    `${BASE_URL}${url.startsWith("/") ? url : "/" + url}`
  );

  // For protected endpoints, always use authenticated requests
  if (
    url.includes("admin/") ||
    url.startsWith("admin/") ||
    url.includes("recruiter-jobs") ||
    url.includes("recruiter-stats") ||
    url.includes("application/") ||
    url.includes("Users/")
  ) {
    try {
      const res = await api.get(url);
      console.log("Protected API response status:", res.status);
      console.log("Protected API response data:", res.data);

      // For recruiter-jobs endpoint, return the full response data (includes pagination)
      if (url.includes("recruiter-jobs") || url.includes("recruiter-stats")) {
        console.log(
          "Returning full response data for recruiter endpoint:",
          res.data
        );
        return res.data;
      }

      // For other endpoints, return result if available, otherwise full data
      const returnData =
        res.data?.result !== undefined ? res.data.result : res.data;
      console.log("Returning data:", returnData);
      return returnData;
    } catch (error) {
      console.error("Protected API Error Details:");
      console.error("- Status:", error.response?.status);
      console.error("- Status Text:", error.response?.statusText);
      console.error("- Data:", error.response?.data);
      console.error("- Message:", error.message);
      console.error("- URL:", error.config?.url);

      // Create a more informative error object
      const enhancedError = {
        ...error,
        response: {
          ...error.response,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        },
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      };

      throw enhancedError;
    }
  }

  try {
    // Try first without credentials for public endpoints
    const publicRes = await axios.get(
      `${BASE_URL}${url.startsWith("/") ? url : "/" + url}`,
      {
        withCredentials: false,
      }
    );
    console.log("Public API response:", publicRes.data);
    return publicRes.data?.result !== undefined
      ? publicRes.data.result
      : publicRes.data;
  } catch (error) {
    console.error("API Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    // If the public request fails, try with credentials
    if (error.response?.status === 403 || error.response?.status === 401) {
      const res = await api.get(url);
      return res.data?.result !== undefined ? res.data.result : res.data;
    }
    throw error;
  }
};

export const getSingleHandler = async (url) => {
  const res = await api.get(url);
  return res?.data?.result;
};

export const postHandler = async ({ url, body }) => {
  try {
    const response = await api.post(url, body);
    return response;
  } catch (error) {
    console.error("Post request error:", {
      url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });

    // Enhance error object with more readable error message
    if (error.response?.data) {
      error.message =
        typeof error.response.data === "string"
          ? error.response.data
          : error.response.data.message ||
            error.response.data.error ||
            error.message;
    }

    throw error;
  }
};

export const updateHandler = async ({ url, body }) => {
  const res = await api.patch(url, body);
  return res?.data?.result;
};

export const updateHandlerPut = async ({ url, body }) => {
  return await api.put(url, body);
};

export const deleteHandler = async (url) => {
  return await api.delete(url);
};

export const logoutHandler = async () => {
  return await api.post("/auth/logout");
};
