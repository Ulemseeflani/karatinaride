import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  Loader2,
  MapPin,
  Navigation,
  Navigation2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { RideStatus } from "../backend";
import { Layout } from "../components/Layout";
import { MapCanvas } from "../components/MapCanvas";
import { RideStatusBadge } from "../components/RideStatusBadge";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { usePolling } from "../hooks/usePolling";
import { KARATINA_CAMPUS, KARATINA_TOWN, locationLabel } from "../lib/geo";
import { useAuthStore } from "../store/auth";
import { useRideStore } from "../store/ride";
import type { DriverInfo, Location, Ride } from "../types";

const DESTINATIONS = [
  { label: "Karatina Town Center", loc: KARATINA_TOWN },
  { label: "Karatina University - Main Gate", loc: KARATINA_CAMPUS },
];

function StatusBanner({ status }: { status: RideStatus }) {
  if (status === RideStatus.Searching) {
    return (
      <div
        className="rounded-xl border border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/10 p-3 flex items-center gap-2.5"
        data-ocid="passenger.searching_banner"
      >
        <Loader2 className="w-4 h-4 animate-spin text-[color:var(--chart-3)] shrink-0" />
        <div>
          <div className="font-semibold text-sm text-foreground">
            Looking for your driver...
          </div>
          <div className="text-xs text-muted-foreground">
            Usually takes under 2 minutes
          </div>
        </div>
      </div>
    );
  }
  if (status === RideStatus.Accepted) {
    return (
      <div
        className="rounded-xl border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 p-3 flex items-center gap-2.5"
        data-ocid="passenger.accepted_banner"
      >
        <Navigation2 className="w-4 h-4 text-primary shrink-0" />
        <div>
          <div className="font-semibold text-sm text-foreground">
            Driver is on the way!
          </div>
          <div className="text-xs text-muted-foreground">
            Your driver has accepted the ride
          </div>
        </div>
      </div>
    );
  }
  if (status === RideStatus.Ongoing) {
    return (
      <div
        className="rounded-xl border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 p-3 flex items-center gap-2.5"
        data-ocid="passenger.ongoing_banner"
      >
        <Navigation className="w-4 h-4 text-primary animate-pulse shrink-0" />
        <div>
          <div className="font-semibold text-sm text-foreground">
            You are on your way!
          </div>
          <div className="text-xs text-muted-foreground">Enjoy the ride</div>
        </div>
      </div>
    );
  }
  if (status === RideStatus.Completed) {
    return (
      <div
        className="rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 p-3 flex items-center gap-2.5"
        data-ocid="passenger.completed_banner"
      >
        <CheckCircle className="w-4 h-4 text-accent shrink-0" />
        <div>
          <div className="font-semibold text-sm text-foreground">
            Arrived! Trip complete. 🎉
          </div>
          <div className="text-xs text-muted-foreground">
            Please pay your driver KSh 100 cash
          </div>
        </div>
      </div>
    );
  }
  return null;
}

export function PassengerPage() {
  const { user } = useAuthStore();
  const { ride, setRide, driverInfo, setDriverInfo, clearRide } =
    useRideStore();
  const { actor } = useActor(createActor);
  const { coords, loading: gpsLoading, error: gpsError } = useGeoLocation();
  const navigate = useNavigate();

  const [pickup, setPickup] = useState<Location | null>(null);
  const [destIndex, setDestIndex] = useState(0);
  const [requesting, setRequesting] = useState(false);

  // Redirect if not logged in or wrong role
  useEffect(() => {
    if (!user) navigate({ to: "/" });
    else if (user.role !== "Passenger") navigate({ to: "/driver" });
  }, [user, navigate]);

  // Set pickup from geolocation
  useEffect(() => {
    if (coords) setPickup(coords);
  }, [coords]);

  // Poll active ride every 2 seconds
  const { data: activeRide } = usePolling(
    async () => {
      if (!actor) return null;
      return actor.getMyActiveRide() as Promise<Ride | null>;
    },
    2000,
    !!actor,
  );

  useEffect(() => {
    if (activeRide !== undefined) setRide(activeRide);
  }, [activeRide, setRide]);

  // Poll driver info when ride is active and has a driver
  const { data: drivers } = usePolling(
    async () => {
      if (!actor || !ride?.driverId) return [];
      return actor.getOnlineDrivers() as Promise<DriverInfo[]>;
    },
    3000,
    !!actor && !!ride?.driverId,
  );

  useEffect(() => {
    if (!drivers || !ride?.driverId) return;
    const dId = ride.driverId?.toString();
    const d = drivers.find((dr) => dr.userId.toString() === dId);
    setDriverInfo(d ?? null);
  }, [drivers, ride, setDriverInfo]);

  const destination = DESTINATIONS[destIndex].loc;

  async function handleRequestRide() {
    if (!actor || !pickup) return;
    setRequesting(true);
    try {
      const result = await actor.requestRide(pickup, destination);
      if (result.__kind__ === "ok") {
        setRide(result.ok as Ride);
        toast.success("Ride requested! Finding a driver...");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to request ride.");
    } finally {
      setRequesting(false);
    }
  }

  async function handleCancelRide() {
    if (!actor || !ride) return;
    try {
      await actor.cancelRide(ride.id);
      clearRide();
      toast.success("Ride cancelled.");
    } catch {
      toast.error("Failed to cancel ride.");
    }
  }

  const hasActiveRide =
    !!ride &&
    ride.status !== RideStatus.Completed &&
    ride.status !== RideStatus.Cancelled;

  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        {/* Map area */}
        <div className="flex-1 min-h-[320px] bg-muted/30 p-3">
          <MapCanvas
            pickupLocation={pickup}
            destinationLocation={destination}
            driverLocation={driverInfo?.lastLocation}
            showCampus
            showTown
            className="shadow-card"
          />
        </div>

        {/* Bottom panel */}
        <div className="bg-card border-t border-border p-4 space-y-4">
          {!hasActiveRide ? (
            <>
              {/* Pickup location display */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-primary" /> Pickup Location
                </p>
                <div
                  className="rounded-lg border border-input bg-muted/30 px-3 py-2.5 text-sm text-foreground min-h-[40px] flex items-center"
                  data-ocid="passenger.pickup_input"
                >
                  {gpsLoading ? (
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" /> Detecting GPS
                      location...
                    </span>
                  ) : gpsError ? (
                    <span className="text-muted-foreground text-xs">
                      📍{" "}
                      {pickup
                        ? locationLabel(pickup)
                        : "Karatina University - Main Gate"}
                    </span>
                  ) : pickup ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                      {locationLabel(pickup)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Waiting for GPS...
                    </span>
                  )}
                </div>
                {gpsError && (
                  <p className="text-xs text-muted-foreground">⚠️ {gpsError}</p>
                )}
              </div>

              {/* Destination selector */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Navigation className="w-3 h-3 text-primary" /> Destination
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {DESTINATIONS.map((d, i) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setDestIndex(i)}
                      className={`rounded-lg border px-3 py-2.5 text-xs text-left transition-smooth ${
                        destIndex === i
                          ? "border-primary bg-primary/5 font-semibold text-primary"
                          : "border-border hover:border-primary/40 text-foreground"
                      }`}
                      data-ocid={`passenger.destination_button.${i + 1}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full h-12 font-display font-semibold text-base shadow-elevated"
                onClick={handleRequestRide}
                disabled={!pickup || requesting}
                data-ocid="passenger.request_ride_button"
              >
                {requesting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Finding driver...
                  </>
                ) : (
                  "Request Ride — KSh 100"
                )}
              </Button>
            </>
          ) : (
            <>
              {/* Status header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Ride status
                  </div>
                  <RideStatusBadge
                    status={ride.status}
                    data-ocid="passenger.ride_status_badge"
                  />
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Fare</div>
                  <div className="font-display font-bold text-xl text-foreground">
                    KSh {Number(ride.fare)}
                  </div>
                </div>
              </div>

              {/* Status banner */}
              <StatusBanner status={ride.status} />

              {/* Driver info card — visible when driver assigned */}
              {(ride.status === RideStatus.Accepted ||
                ride.status === RideStatus.Ongoing) && (
                <div
                  className="rounded-xl bg-muted/30 border border-border p-3 flex items-center gap-3"
                  data-ocid="passenger.driver_info_card"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground truncate">
                      Your Driver
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {driverInfo?.lastLocation
                        ? `📍 ${locationLabel(driverInfo.lastLocation)}`
                        : "Heading your way"}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">Fare</div>
                    <div className="font-bold text-sm text-foreground">
                      KSh 100
                    </div>
                  </div>
                </div>
              )}

              {/* Trip summary — completed */}
              {ride.status === RideStatus.Completed && (
                <div
                  className="rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 p-4 space-y-2"
                  data-ocid="passenger.trip_summary_card"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-base text-foreground">
                      Trip Summary
                    </span>
                    <CheckCircle className="w-5 h-5 text-accent" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">From</span>
                      <span className="font-medium text-foreground">
                        {locationLabel(ride.pickup)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">To</span>
                      <span className="font-medium text-foreground">
                        {locationLabel(ride.destination)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-border pt-1 mt-1">
                      <span className="font-semibold text-foreground">
                        Total Fare (Cash)
                      </span>
                      <span className="font-bold text-foreground">
                        KSh {Number(ride.fare)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {(ride.status === RideStatus.Searching ||
                ride.status === RideStatus.Accepted) && (
                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleCancelRide}
                  data-ocid="passenger.cancel_ride_button"
                >
                  Cancel Ride
                </Button>
              )}

              {ride.status === RideStatus.Completed && (
                <Button
                  className="w-full font-display font-semibold"
                  onClick={() => clearRide()}
                  data-ocid="passenger.new_ride_button"
                >
                  Book Another Ride
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}
