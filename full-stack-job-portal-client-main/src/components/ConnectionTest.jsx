import React, { useEffect, useState } from "react";
import { testConnection } from "../utils/FetchHandlers";

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState("Testing...");

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testConnection();
        setConnectionStatus(
          isConnected ? "Connected to server!" : "Failed to connect to server"
        );
      } catch (error) {
        setConnectionStatus("Error connecting to server");
      }
    };

    checkConnection();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        margin: "20px",
        border: "2px solid",
        borderColor: connectionStatus.includes("Connected")
          ? "#4CAF50"
          : connectionStatus.includes("Testing")
          ? "#FF9800"
          : "#f44336",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 1000,
        maxWidth: "300px",
      }}
    >
      <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>
        Server Connection Status:
      </h2>
      <p
        style={{
          margin: 0,
          padding: "10px",
          backgroundColor: connectionStatus.includes("Connected")
            ? "#E8F5E9"
            : connectionStatus.includes("Testing")
            ? "#FFF3E0"
            : "#FFEBEE",
          borderRadius: "4px",
          color: connectionStatus.includes("Connected")
            ? "#2E7D32"
            : connectionStatus.includes("Testing")
            ? "#E65100"
            : "#C62828",
          fontWeight: "bold",
        }}
      >
        {connectionStatus}
      </p>
    </div>
  );
};

export default ConnectionTest;
