import { useEffect, useState } from "react";
import { KARATINA_CAMPUS } from "../lib/geo";
import type { Location } from "../types";

interface GeoState {
  coords: Location | null;
  error: string | null;
  loading: boolean;
}

export function useGeoLocation(): GeoState {
  const [state, setState] = useState<GeoState>({
    coords: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coords: KARATINA_CAMPUS,
        error: "Geolocation not supported — using campus as default",
        loading: false,
      });
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          loading: false,
        });
      },
      () => {
        setState({
          coords: KARATINA_CAMPUS,
          error: "Location unavailable — using campus as default",
          loading: false,
        });
      },
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
