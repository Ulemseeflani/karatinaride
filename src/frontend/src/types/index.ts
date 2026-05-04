import type { Principal } from "@icp-sdk/core/principal";
import type { RideStatus, Role } from "../backend";
export { Role, RideStatus } from "../backend";

export type UserId = Principal;

export interface Location {
  lat: number;
  lng: number;
}

export interface User {
  id: UserId;
  name: string;
  phone: string;
  role: Role;
  createdAt: bigint;
}

export interface DriverInfo {
  userId: UserId;
  online: boolean;
  lastLocation?: Location;
  lastSeen: bigint;
}

export interface Ride {
  id: string;
  passengerId: UserId;
  driverId?: UserId;
  pickup: Location;
  destination: Location;
  status: RideStatus;
  createdAt: bigint;
  fare: bigint;
}

export type BackendResult<T> =
  | { __kind__: "ok"; ok: T }
  | { __kind__: "err"; err: string };
