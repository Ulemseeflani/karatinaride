import type { backendInterface, Location, Role, RideStatus } from "../backend";

const mockLocation: Location = { lat: -0.4814, lng: 37.1258 };
const mockDestination: Location = { lat: -0.4833, lng: 37.1222 };

const mockRide = {
  id: "ride-001",
  status: "Searching" as RideStatus,
  driverId: undefined,
  destination: mockDestination,
  fare: BigInt(100),
  createdAt: BigInt(Date.now()),
  pickup: mockLocation,
  passengerId: { toText: () => "passenger-001" } as unknown as import("../backend").UserId,
};

const mockUser = {
  id: { toText: () => "user-001" } as unknown as import("../backend").UserId,
  name: "James Mwangi",
  createdAt: BigInt(Date.now()),
  role: "Passenger" as unknown as Role,
  phone: "0712345678",
};

export const mockBackend: backendInterface = {
  acceptRide: async (_rideId: string) => ({
    __kind__: "ok" as const,
    ok: { ...mockRide, status: "Accepted" as RideStatus },
  }),
  cancelRide: async (_rideId: string) => ({ __kind__: "ok" as const, ok: null }),
  completeRide: async (_rideId: string) => ({
    __kind__: "ok" as const,
    ok: { ...mockRide, status: "Completed" as RideStatus },
  }),
  getCurrentUser: async () => mockUser,
  getMyActiveRide: async () => null,
  getOnlineDrivers: async () => [
    {
      userId: { toText: () => "driver-001" } as unknown as import("../backend").UserId,
      lastLocation: mockLocation,
      lastSeen: BigInt(Date.now()),
      online: true,
    },
  ],
  getPendingRides: async () => [mockRide],
  getRide: async (_id: string) => mockRide,
  getUser: async (_id) => mockUser,
  registerUser: async (name: string, phone: string, role: Role) => ({
    __kind__: "ok" as const,
    ok: { ...mockUser, name, phone, role },
  }),
  rejectRide: async (_rideId: string) => ({ __kind__: "ok" as const, ok: null }),
  requestRide: async (_pickup: Location, _destination: Location) => ({
    __kind__: "ok" as const,
    ok: mockRide,
  }),
  setDriverOnline: async (_online: boolean) => ({ __kind__: "ok" as const, ok: null }),
  startRide: async (_rideId: string) => ({
    __kind__: "ok" as const,
    ok: { ...mockRide, status: "Ongoing" as RideStatus },
  }),
  updateDriverLocation: async (_lat: number, _lng: number) => ({ __kind__: "ok" as const, ok: null }),
};
