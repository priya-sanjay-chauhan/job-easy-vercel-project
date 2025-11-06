const axios = require("axios");

const testAuth = async () => {
  try {
    console.log("Testing unauthenticated request...");
    const response = await axios.get(
      "http://localhost:8080/api/v1/jobs/recruiter-jobs?page=1&limit=10",
      {
        withCredentials: true,
      }
    );
    console.log("Response:", response.data);
  } catch (error) {
    console.log("Full error:", error);
    console.log("Error status:", error.response?.status);
    console.log("Error data:", error.response?.data);
    console.log("Error message:", error.message);
    console.log("Error code:", error.code);
  }
};

testAuth();
