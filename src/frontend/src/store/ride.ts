import { create } from "zustand";
import type { DriverInfo, Ride } from "../types";

interface RideState {
  ride: Ride | null;
  driverInfo: DriverInfo | null;
  pendingRides: Ride[];
  setRide: (ride: Ride | null) => void;
  setDriverInfo: (info: DriverInfo | null) => void;
  setPendingRides: (rides: Ride[]) => void;
  clearRide: () => void;
}

export const useRideStore = create<RideState>((set) => ({
  ride: null,
  driverInfo: null,
  pendingRides: [],
  setRide: (ride) => set({ ride }),
  setDriverInfo: (driverInfo) => set({ driverInfo }),
  setPendingRides: (pendingRides) => set({ pendingRides }),
  clearRide: () => set({ ride: null, driverInfo: null }),
}));
