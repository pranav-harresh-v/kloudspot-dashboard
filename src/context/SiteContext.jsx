import React, { createContext, useState, useContext, useEffect } from "react";
import { getSites } from "../services/api";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSites = async () => {
      try {
        const data = await getSites();
        if (isMounted && data && data.length > 0) {
          setSites(data);
          setSelectedSite(data[0]);
        }
      } catch (error) {
        // Handled by API interceptor or ignored
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSites();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SiteContext.Provider
      value={{ sites, selectedSite, setSelectedSite, loading }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
