import { useEffect } from "react";
import { socket } from "../services/socket";

export const useLiveOccupancy = (selectedSite, setMetrics) => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) socket.auth = { token };
    socket.connect();

    const handleLiveUpdate = (data) => {
      if (selectedSite && data.siteId === selectedSite.siteId) {
        setMetrics((prev) => ({
          ...prev,
          occupancy: data.siteOccupancy || prev.occupancy,
        }));
      }
    };

    socket.on("live_occupancy", handleLiveUpdate);

    return () => {
      socket.off("live_occupancy", handleLiveUpdate);
      socket.disconnect();
    };
  }, [selectedSite, setMetrics]);
};
