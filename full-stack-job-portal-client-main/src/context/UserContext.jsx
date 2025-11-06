import React, { useContext, useEffect, useState } from "react";
import { getSingleHandler } from "../utils/FetchHandlers";

const userContext = React.createContext();

const UserContext = ({ children }) => {
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState({ status: false, message: "" });
  const [user, setUser] = useState({});

  const handleFetchMe = async () => {
    setUserLoading(true);
    try {
      const result = await getSingleHandler("/auth/me");
      setUserError({ status: false, message: "" });
      setUser(result);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUserError({ status: true, message: error?.message });
      setUser({ status: false });
    }
    setUserLoading(false);
  };

  useEffect(() => {
    handleFetchMe();
  }, []);

  const passing = { userLoading, userError, user, handleFetchMe };
  return (
    <userContext.Provider value={passing}>{children}</userContext.Provider>
  );
};

const useUserContext = () => useContext(userContext);

export { useUserContext, UserContext };
