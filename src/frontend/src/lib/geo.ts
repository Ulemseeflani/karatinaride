import type { Location } from "../types";

// Karatina reference coordinates
export const KARATINA_CAMPUS: Location = {
  lat: -0.4848,
  lng: 37.1456,
};

export const KARATINA_TOWN: Location = {
  lat: -0.4819,
  lng: 37.1529,
};

export const FIXED_FARE = 100; // KSh

export function getCurrentPosition(): Promise<Location> {
  return new Promise((resolve, _reject) => {
    if (!navigator.geolocation) {
      resolve(KARATINA_CAMPUS);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        // Fall back to campus coords on error
        resolve(KARATINA_CAMPUS);
      },
      { timeout: 8000, enableHighAccuracy: true },
    );
  });
}

export function watchPosition(
  onUpdate: (location: Location) => void,
  onError?: () => void,
): number {
  if (!navigator.geolocation) {
    onError?.();
    return -1;
  }
  return navigator.geolocation.watchPosition(
    (pos) => {
      onUpdate({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    },
    () => {
      onError?.();
    },
    { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
  );
}

export function clearWatch(watchId: number): void {
  if (watchId >= 0) navigator.geolocation.clearWatch(watchId);
}

// Haversine distance in km
export function calculateDistance(a: Location, b: Location): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const c =
    2 *
    Math.atan2(
      Math.sqrt(
        sinDLat * sinDLat +
          Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng,
      ),
      Math.sqrt(
        1 -
          sinDLat * sinDLat +
          Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng,
      ),
    );
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function locationLabel(loc: Location): string {
  const campusDist = calculateDistance(loc, KARATINA_CAMPUS);
  const townDist = calculateDistance(loc, KARATINA_TOWN);
  if (campusDist < 0.5) return "Karatina University - Main Gate";
  if (townDist < 0.5) return "Karatina Town Center";
  return `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
}
