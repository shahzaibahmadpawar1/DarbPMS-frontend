import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useStation } from "../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function useResolvedStationCode() {
  const { stationId } = useParams();
  const { selectedStation } = useStation();
  const [stationCode, setStationCode] = useState(selectedStation?.station_code || "");

  useEffect(() => {
    if (selectedStation?.station_code) {
      setStationCode(selectedStation.station_code);
      return;
    }

    if (!stationId) {
      return;
    }

    const token = localStorage.getItem("auth_token");
    if (!token) {
      return;
    }

    let isMounted = true;

    const fetchStation = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const result = await response.json();
        const code = result?.data?.station_code;

        if (isMounted && code) {
          setStationCode(code);
        }
      } catch {
        // Ignore and keep existing resolved value.
      }
    };

    fetchStation();

    return () => {
      isMounted = false;
    };
  }, [selectedStation?.station_code, stationId]);

  return stationCode;
}
