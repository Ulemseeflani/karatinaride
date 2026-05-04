import { Button } from "@/components/ui/button";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  MapPin,
  Navigation,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { RideStatus } from "../backend";
import { Layout } from "../components/Layout";
import { MapCanvas } from "../components/MapCanvas";
import { RideStatusBadge } from "../components/RideStatusBadge";
import { useGeoLocation } from "../hooks/useGeoLocation";
import { usePolling } from "../hooks/usePolling";
import { clearWatch, locationLabel, watchPosition } from "../lib/geo";
import { useAuthStore } from "../store/auth";
import { useRideStore } from "../store/ride";
import type { Location, Ride } from "../types";

export function DriverPage() {
  const { user } = useAuthStore();
  const { ride, setRide, clearRide } = useRideStore();
  const { actor } = useActor(createActor);
  const { coords } = useGeoLocation();
  const navigate = useNavigate();

  const [online, setOnline] = useState(false);
  const [togglingOnline, setTogglingOnline] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showEarnings, setShowEarnings] = useState(false);
  const watchIdRef = useRef<number>(-1);
  const lastLatRef = useRef<number | null>(null);
  const lastLngRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user) navigate({ to: "/" });
    else if (user.role !== "Driver") navigate({ to: "/passenger" });
  }, [user, navigate]);

  useEffect(() => {
    if (!online || !actor) {
      clearWatch(watchIdRef.current);
      return;
    }
    // watchPosition keeps coords fresh on movement
    watchIdRef.current = watchPosition(
      (loc: Location) => {
        lastLatRef.current = loc.lat;
        lastLngRef.current = loc.lng;
      },
      () => {},
    );
    // setInterval guarantees a backend ping every 5 seconds regardless of movement
    const intervalId = setInterval(() => {
      const lat = lastLatRef.current;
      const lng = lastLngRef.current;
      if (lat !== null && lng !== null) {
        actor.updateDriverLocation(lat, lng).catch(() => {});
      }
    }, 5000);
    return () => {
      clearWatch(watchIdRef.current);
      clearInterval(intervalId);
    };
  }, [online, actor]);

  const { data: activeRide } = usePolling(
    async () => {
      if (!actor) return null;
      return actor.getMyActiveRide() as Promise<Ride | null>;
    },
    3000,
    !!actor && online,
  );

  useEffect(() => {
    if (activeRide !== undefined) setRide(activeRide);
  }, [activeRide, setRide]);

  const { data: pendingRides } = usePolling(
    async () => {
      if (!actor) return [];
      return actor.getPendingRides() as Promise<Ride[]>;
    },
    3000,
    !!actor && online && !ride,
  );

  async function toggleOnline() {
    if (!actor) return;
    setTogglingOnline(true);
    try {
      const newState = !online;
      const result = await actor.setDriverOnline(newState);
      if (result.__kind__ === "ok") {
        setOnline(newState);
        toast.success(newState ? "You're now online!" : "You're now offline.");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to update online status.");
    } finally {
      setTogglingOnline(false);
    }
  }

  async function handleAccept(rideId: string) {
    if (!actor) return;
    setActionLoading(rideId);
    try {
      const result = await actor.acceptRide(rideId);
      if (result.__kind__ === "ok") {
        setRide(result.ok as Ride);
        toast.success("Ride accepted!");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to accept ride.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(rideId: string) {
    if (!actor) return;
    setActionLoading(rideId);
    try {
      await actor.rejectRide(rideId);
      toast.success("Ride skipped.");
    } catch {
      toast.error("Failed to reject ride.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleStartRide() {
    if (!actor || !ride) return;
    setActionLoading("start");
    try {
      const result = await actor.startRide(ride.id);
      if (result.__kind__ === "ok") {
        setRide(result.ok as Ride);
        toast.success("Ride started! Safe travels.");
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to start ride.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCompleteRide() {
    if (!actor || !ride) return;
    setActionLoading("complete");
    try {
      const result = await actor.completeRide(ride.id);
      if (result.__kind__ === "ok") {
        setRide(result.ok as Ride);
        setShowEarnings(true);
        toast.success("Trip completed! Collect KSh 100 from passenger.");
        setTimeout(() => {
          setShowEarnings(false);
          clearRide();
        }, 4000);
      } else {
        toast.error(result.err);
      }
    } catch {
      toast.error("Failed to complete ride.");
    } finally {
      setActionLoading(null);
    }
  }

  const hasActiveRide =
    !!ride &&
    ride.status !== RideStatus.Completed &&
    ride.status !== RideStatus.Cancelled;

  const showPending = online && !hasActiveRide && !showEarnings;
  const hasPending = pendingRides && pendingRides.length > 0;

  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        {/* Map area */}
        <div className="flex-1 min-h-[280px] bg-muted/30 p-3">
          <MapCanvas
            pickupLocation={hasActiveRide ? ride?.pickup : coords}
            destinationLocation={hasActiveRide ? ride?.destination : undefined}
            driverLocation={coords}
            showCampus
            showTown
            className="shadow-card"
          />
        </div>

        {/* Bottom panel */}
        <div className="bg-card border-t border-border p-4 space-y-4">
          {/* Online/Offline toggle */}
          <div
            className={`flex items-center justify-between rounded-xl p-3 border ${
              online
                ? "bg-accent/5 border-accent/30"
                : "bg-muted/40 border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {online ? (
                <Wifi className="w-4 h-4 text-accent" />
              ) : (
                <WifiOff className="w-4 h-4 text-muted-foreground" />
              )}
              <div>
                <div className="text-sm font-semibold">
                  {online ? "Online" : "Offline"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {online
                    ? "Accepting ride requests"
                    : "Not visible to passengers"}
                </div>
              </div>
            </div>
            <Button
              size="sm"
              variant={online ? "destructive" : "default"}
              onClick={toggleOnline}
              disabled={togglingOnline}
              className={
                !online
                  ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                  : ""
              }
              data-ocid="driver.online_toggle_button"
            >
              {togglingOnline ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : online ? (
                "Go Offline"
              ) : (
                "Go Online"
              )}
            </Button>
          </div>

          {/* Offline message */}
          {!online && (
            <div
              className="rounded-xl bg-muted/40 border border-border p-5 text-center"
              data-ocid="driver.offline_empty_state"
            >
              <WifiOff className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <div className="font-semibold text-sm text-foreground mb-1">
                You are offline
              </div>
              <div className="text-xs text-muted-foreground">
                Tap "Go Online" above to start receiving ride requests.
              </div>
            </div>
          )}

          {/* Earnings confirmation card */}
          {showEarnings && (
            <div
              className="rounded-xl bg-[color:var(--primary)]/10 border-2 border-[color:var(--primary)]/30 p-5 text-center"
              data-ocid="driver.earnings_card"
            >
              <CheckCircle className="w-10 h-10 text-primary mx-auto mb-2" />
              <div className="font-display font-bold text-xl text-foreground">
                KSh 100 Earned! 💵
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Collect cash from passenger
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                Returning to dashboard in a moment...
              </div>
            </div>
          )}

          {/* Active ride panel */}
          {online && hasActiveRide && ride && !showEarnings && (
            <div className="space-y-3" data-ocid="driver.active_ride_panel">
              <div className="flex items-center justify-between">
                <div className="font-semibold text-sm text-foreground">
                  Active Ride
                </div>
                <RideStatusBadge
                  status={ride.status}
                  data-ocid="driver.ride_status_badge"
                />
              </div>
              <div className="rounded-xl bg-muted/30 border border-border p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">Pickup</div>
                    <div className="text-sm font-medium text-foreground truncate">
                      {locationLabel(ride.pickup)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Navigation className="w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">
                      Destination
                    </div>
                    <div className="text-sm font-medium text-foreground truncate">
                      {locationLabel(ride.destination)}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-2">
                  <span className="text-xs text-muted-foreground">Fare</span>
                  <span className="font-bold text-base text-foreground">
                    KSh {Number(ride.fare)}
                  </span>
                </div>
              </div>
              {ride.status === RideStatus.Accepted && (
                <Button
                  className="w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold"
                  onClick={handleStartRide}
                  disabled={actionLoading === "start"}
                  data-ocid="driver.start_ride_button"
                >
                  {actionLoading === "start" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Start Ride →"
                  )}
                </Button>
              )}
              {ride.status === RideStatus.Ongoing && (
                <Button
                  className="w-full h-11 font-display font-semibold shadow-elevated"
                  onClick={handleCompleteRide}
                  disabled={actionLoading === "complete"}
                  data-ocid="driver.complete_ride_button"
                >
                  {actionLoading === "complete" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "End Trip — Collect KSh 100"
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Pending ride requests list */}
          {showPending && hasPending && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                Incoming requests ({pendingRides.length})
              </div>
              {pendingRides.slice(0, 3).map((r, i) => (
                <div
                  key={r.id}
                  className="rounded-xl border border-border bg-background p-3 space-y-2"
                  data-ocid={`driver.ride_request.${i + 1}`}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {locationLabel(r.pickup)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <Navigation className="w-3 h-3 shrink-0" />
                        <span className="truncate">
                          {locationLabel(r.destination)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-base text-foreground">
                        KSh {Number(r.fare)}
                      </div>
                      <div className="text-xs text-muted-foreground">Fixed</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(r.id)}
                      disabled={actionLoading === r.id}
                      className="flex-1 border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                      data-ocid={`driver.reject_button.${i + 1}`}
                    >
                      Ignore
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAccept(r.id)}
                      disabled={actionLoading === r.id}
                      className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      data-ocid={`driver.accept_button.${i + 1}`}
                    >
                      {actionLoading === r.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Accept"
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No requests empty state */}
          {showPending && !hasPending && (
            <div
              className="rounded-xl bg-muted/40 border border-border p-5 text-center"
              data-ocid="driver.no_requests_empty_state"
            >
              <div className="text-2xl mb-2">🚗</div>
              <div className="font-semibold text-sm text-foreground">
                No requests yet
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Waiting for nearby passengers...
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
