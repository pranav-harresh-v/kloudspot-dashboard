import { useState, useEffect } from "react";
import {
  getOccupancy,
  getFootfall,
  getDwellTime,
  getDemographics,
} from "../services/api";
import { FIXED_HOURS } from "../config/chartConfig";

export const useDashboardData = (selectedSite) => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    occupancy: 0,
    footfall: 0,
    dwellTime: "00m 00s",
  });
  const [charts, setCharts] = useState({
    occupancyData: [],
    demoMale: [],
    demoFemale: [],
    totals: { malePct: 50, femalePct: 50 },
  });
  const [trends, setTrends] = useState({ footfall: 0, dwell: 0 });

  useEffect(() => {
    if (!selectedSite?.siteId) return;

    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const start = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const end = new Date(now.setHours(23, 59, 59, 999)).getTime();
        const yStart = start - 86400000;
        const yEnd = end - 86400000;

        const [occRes, footRes, dwellRes, demoRes, yFootRes, yDwellRes] =
          await Promise.all([
            getOccupancy(start, end, selectedSite.siteId),
            getFootfall(start, end, selectedSite.siteId),
            getDwellTime(start, end, selectedSite.siteId),
            getDemographics(start, end, selectedSite.siteId),
            getFootfall(yStart, yEnd, selectedSite.siteId),
            getDwellTime(yStart, yEnd, selectedSite.siteId),
          ]);

        if (!isMounted) return;

        const mapToFixedAxis = (buckets, valueKey) => {
          return FIXED_HOURS.map((hourLabel) => {
            const hourPrefix = hourLabel.split(":")[0];
            const bucket = buckets.find((b) => {
              if (!b.local) return false;
              const timePart = b.local.split(" ")[1];
              return timePart.startsWith(hourPrefix);
            });
            if (!bucket || !bucket[valueKey] || bucket[valueKey] === 0)
              return null;
            return bucket[valueKey];
          });
        };

        const occData = mapToFixedAxis(occRes.data?.buckets || [], "avg");
        const maleData = mapToFixedAxis(demoRes.data?.buckets || [], "male");
        const femaleData = mapToFixedAxis(
          demoRes.data?.buckets || [],
          "female"
        );

        let totalMale = 0,
          totalFemale = 0;
        (demoRes.data?.buckets || []).forEach((b) => {
          totalMale += b.male || 0;
          totalFemale += b.female || 0;
        });

        const grandTotal = totalMale + totalFemale;
        const malePct = grandTotal > 0 ? (totalMale / grandTotal) * 100 : 50;
        const femalePct =
          grandTotal > 0 ? (totalFemale / grandTotal) * 100 : 50;

        const todayFoot = footRes.data?.footfall || 0;
        const yestFoot = yFootRes.data?.footfall || 0;
        const footTrend =
          yestFoot > 0 ? ((todayFoot - yestFoot) / yestFoot) * 100 : 0;

        const todayDwell = dwellRes.data?.avgDwellMinutes || 0;
        const yestDwell = yDwellRes.data?.avgDwellMinutes || 0;
        const dwellTrend =
          yestDwell > 0 ? ((todayDwell - yestDwell) / yestDwell) * 100 : 0;

        setCharts({
          occupancyData: occData,
          demoMale: maleData,
          demoFemale: femaleData,
          totals: { malePct, femalePct },
        });

        setTrends({ footfall: footTrend, dwell: dwellTrend });

        setMetrics({
          occupancy: occRes.data?.current || 0,
          footfall: todayFoot,
          dwellTime: `${Math.round(todayDwell)}m 00s`,
        });
      } catch (error) {
        // Silent fail for production
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [selectedSite]);

  return { metrics, setMetrics, charts, trends, loading };
};
