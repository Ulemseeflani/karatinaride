import { createActor } from "../backend";
import { useActor } from "@caffeineai/core-infrastructure";
import type { Location, User, DriverInfo, Ride } from "../types";
import { Role } from "../backend";
import type { BackendResult } from "../types";

// Re-export createActor for use in hooks
export { createActor };

// Typed result unwrapper
export function unwrapResult<T>(result: BackendResult<T>): T {
  if (result.__kind__ === "ok") return result.ok;
  throw new Error(result.err);
}

// All actor calls are made via useActor in hooks/useQueries.ts
// This file provides typed helper wrappers

export async function callRegisterUser(
  actor: ReturnType<typeof createActor>,
  name: string,
  phone: string,
  role: Role
): Promise<User> {
  const result = await actor.registerUser(name, phone, role);
  return unwrapResult(result as BackendResult<User>);
}

export async function callGetCurrentUser(
  actor: ReturnType<typeof createActor>
): Promise<User | null> {
  return actor.getCurrentUser() as Promise<User | null>;
}

export async function callSetDriverOnline(
  actor: ReturnType<typeof createActor>,
  online: boolean
): Promise<void> {
  const result = await actor.setDriverOnline(online);
  unwrapResult(result as BackendResult<null>);
}

export async function callUpdateDriverLocation(
  actor: ReturnType<typeof createActor>,
  lat: number,
  lng: number
): Promise<void> {
  const result = await actor.updateDriverLocation(lat, lng);
  unwrapResult(result as BackendResult<null>);
}

export async function callGetOnlineDrivers(
  actor: ReturnType<typeof createActor>
): Promise<DriverInfo[]> {
  return actor.getOnlineDrivers() as Promise<DriverInfo[]>;
}

export async function callRequestRide(
  actor: ReturnType<typeof createActor>,
  pickup: Location,
  destination: Location
): Promise<Ride> {
  const result = await actor.requestRide(pickup, destination);
  return unwrapResult(result as BackendResult<Ride>);
}

export async function callAcceptRide(
  actor: ReturnType<typeof createActor>,
  rideId: string
): Promise<Ride> {
  const result = await actor.acceptRide(rideId);
  return unwrapResult(result as BackendResult<Ride>);
}

export async function callRejectRide(
  actor: ReturnType<typeof createActor>,
  rideId: string
): Promise<void> {
  const result = await actor.rejectRide(rideId);
  unwrapResult(result as BackendResult<null>);
}

export async function callStartRide(
  actor: ReturnType<typeof createActor>,
  rideId: string
): Promise<Ride> {
  const result = await actor.startRide(rideId);
  return unwrapResult(result as BackendResult<Ride>);
}

export async function callCompleteRide(
  actor: ReturnType<typeof createActor>,
  rideId: string
): Promise<Ride> {
  const result = await actor.completeRide(rideId);
  return unwrapResult(result as BackendResult<Ride>);
}

export async function callCancelRide(
  actor: ReturnType<typeof createActor>,
  rideId: string
): Promise<void> {
  const result = await actor.cancelRide(rideId);
  unwrapResult(result as BackendResult<null>);
}

export async function callGetMyActiveRide(
  actor: ReturnType<typeof createActor>
): Promise<Ride | null> {
  return actor.getMyActiveRide() as Promise<Ride | null>;
}

export async function callGetPendingRides(
  actor: ReturnType<typeof createActor>
): Promise<Ride[]> {
  return actor.getPendingRides() as Promise<Ride[]>;
}

export async function callGetRide(
  actor: ReturnType<typeof createActor>,
  id: string
): Promise<Ride | null> {
  return actor.getRide(id) as Promise<Ride | null>;
}

// Hook to access actor - convenience re-export pattern
export { useActor };
