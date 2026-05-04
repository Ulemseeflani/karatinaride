import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    lat: number;
    lng: number;
}
export type UserId = Principal;
export type Timestamp = bigint;
export interface Ride {
    id: string;
    status: RideStatus;
    driverId?: UserId;
    destination: Location;
    fare: bigint;
    createdAt: Timestamp;
    pickup: Location;
    passengerId: UserId;
}
export type Result_2 = {
    __kind__: "ok";
    ok: User;
} | {
    __kind__: "err";
    err: string;
};
export type Result = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export interface User {
    id: UserId;
    name: string;
    createdAt: Timestamp;
    role: Role;
    phone: string;
}
export interface DriverInfo {
    userId: UserId;
    lastLocation?: Location;
    lastSeen: Timestamp;
    online: boolean;
}
export type Result_1 = {
    __kind__: "ok";
    ok: Ride;
} | {
    __kind__: "err";
    err: string;
};
export enum RideStatus {
    Ongoing = "Ongoing",
    Searching = "Searching",
    Accepted = "Accepted",
    Cancelled = "Cancelled",
    Completed = "Completed"
}
export enum Role {
    Driver = "Driver",
    Passenger = "Passenger"
}
export interface backendInterface {
    acceptRide(rideId: string): Promise<Result_1>;
    cancelRide(rideId: string): Promise<Result>;
    completeRide(rideId: string): Promise<Result_1>;
    getCurrentUser(): Promise<User | null>;
    getMyActiveRide(): Promise<Ride | null>;
    getOnlineDrivers(): Promise<Array<DriverInfo>>;
    getPendingRides(): Promise<Array<Ride>>;
    getRide(id: string): Promise<Ride | null>;
    getUser(id: UserId): Promise<User | null>;
    registerUser(name: string, phone: string, role: Role): Promise<Result_2>;
    rejectRide(rideId: string): Promise<Result>;
    requestRide(pickup: Location, destination: Location): Promise<Result_1>;
    setDriverOnline(online: boolean): Promise<Result>;
    startRide(rideId: string): Promise<Result_1>;
    updateDriverLocation(lat: number, lng: number): Promise<Result>;
}
