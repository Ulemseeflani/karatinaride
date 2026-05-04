import { c as createLucideIcon, d as useAuthStore, e as useActor, u as useNavigate, r as reactExports, h as RideStatus, j as jsxRuntimeExports, B as Button, L as LoaderCircle, M as MapPin, f as ue, g as createActor } from "./index-IFpQRH9a.js";
import { u as useRideStore, a as useGeoLocation, d as clearWatch, w as watchPosition, b as usePolling, L as Layout, M as MapCanvas, C as CircleCheckBig, R as RideStatusBadge, l as locationLabel, N as Navigation } from "./ride-Czj81qtu.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const WifiOff = createLucideIcon("wifi-off", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
];
const Wifi = createLucideIcon("wifi", __iconNode);
function DriverPage() {
  const { user } = useAuthStore();
  const { ride, setRide, clearRide } = useRideStore();
  const { actor } = useActor(createActor);
  const { coords } = useGeoLocation();
  const navigate = useNavigate();
  const [online, setOnline] = reactExports.useState(false);
  const [togglingOnline, setTogglingOnline] = reactExports.useState(false);
  const [actionLoading, setActionLoading] = reactExports.useState(null);
  const [showEarnings, setShowEarnings] = reactExports.useState(false);
  const watchIdRef = reactExports.useRef(-1);
  const lastLatRef = reactExports.useRef(null);
  const lastLngRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!user) navigate({ to: "/" });
    else if (user.role !== "Driver") navigate({ to: "/passenger" });
  }, [user, navigate]);
  reactExports.useEffect(() => {
    if (!online || !actor) {
      clearWatch(watchIdRef.current);
      return;
    }
    watchIdRef.current = watchPosition(
      (loc) => {
        lastLatRef.current = loc.lat;
        lastLngRef.current = loc.lng;
      }
    );
    const intervalId = setInterval(() => {
      const lat = lastLatRef.current;
      const lng = lastLngRef.current;
      if (lat !== null && lng !== null) {
        actor.updateDriverLocation(lat, lng).catch(() => {
        });
      }
    }, 5e3);
    return () => {
      clearWatch(watchIdRef.current);
      clearInterval(intervalId);
    };
  }, [online, actor]);
  const { data: activeRide } = usePolling(
    async () => {
      if (!actor) return null;
      return actor.getMyActiveRide();
    },
    3e3,
    !!actor && online
  );
  reactExports.useEffect(() => {
    if (activeRide !== void 0) setRide(activeRide);
  }, [activeRide, setRide]);
  const { data: pendingRides } = usePolling(
    async () => {
      if (!actor) return [];
      return actor.getPendingRides();
    },
    3e3,
    !!actor && online && !ride
  );
  async function toggleOnline() {
    if (!actor) return;
    setTogglingOnline(true);
    try {
      const newState = !online;
      const result = await actor.setDriverOnline(newState);
      if (result.__kind__ === "ok") {
        setOnline(newState);
        ue.success(newState ? "You're now online!" : "You're now offline.");
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to update online status.");
    } finally {
      setTogglingOnline(false);
    }
  }
  async function handleAccept(rideId) {
    if (!actor) return;
    setActionLoading(rideId);
    try {
      const result = await actor.acceptRide(rideId);
      if (result.__kind__ === "ok") {
        setRide(result.ok);
        ue.success("Ride accepted!");
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to accept ride.");
    } finally {
      setActionLoading(null);
    }
  }
  async function handleReject(rideId) {
    if (!actor) return;
    setActionLoading(rideId);
    try {
      await actor.rejectRide(rideId);
      ue.success("Ride skipped.");
    } catch {
      ue.error("Failed to reject ride.");
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
        setRide(result.ok);
        ue.success("Ride started! Safe travels.");
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to start ride.");
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
        setRide(result.ok);
        setShowEarnings(true);
        ue.success("Trip completed! Collect KSh 100 from passenger.");
        setTimeout(() => {
          setShowEarnings(false);
          clearRide();
        }, 4e3);
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to complete ride.");
    } finally {
      setActionLoading(null);
    }
  }
  const hasActiveRide = !!ride && ride.status !== RideStatus.Completed && ride.status !== RideStatus.Cancelled;
  const showPending = online && !hasActiveRide && !showEarnings;
  const hasPending = pendingRides && pendingRides.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-h-[280px] bg-muted/30 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MapCanvas,
      {
        pickupLocation: hasActiveRide ? ride == null ? void 0 : ride.pickup : coords,
        destinationLocation: hasActiveRide ? ride == null ? void 0 : ride.destination : void 0,
        driverLocation: coords,
        showCampus: true,
        showTown: true,
        className: "shadow-card"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-t border-border p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `flex items-center justify-between rounded-xl p-3 border ${online ? "bg-accent/5 border-accent/30" : "bg-muted/40 border-border"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              online ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "w-4 h-4 text-accent" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-4 h-4 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold", children: online ? "Online" : "Offline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: online ? "Accepting ride requests" : "Not visible to passengers" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: online ? "destructive" : "default",
                onClick: toggleOnline,
                disabled: togglingOnline,
                className: !online ? "bg-accent hover:bg-accent/90 text-accent-foreground" : "",
                "data-ocid": "driver.online_toggle_button",
                children: togglingOnline ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : online ? "Go Offline" : "Go Online"
              }
            )
          ]
        }
      ),
      !online && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl bg-muted/40 border border-border p-5 text-center",
          "data-ocid": "driver.offline_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground mb-1", children: "You are offline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: 'Tap "Go Online" above to start receiving ride requests.' })
          ]
        }
      ),
      showEarnings && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl bg-[color:var(--primary)]/10 border-2 border-[color:var(--primary)]/30 p-5 text-center",
          "data-ocid": "driver.earnings_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-10 h-10 text-primary mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-xl text-foreground", children: "KSh 100 Earned! 💵" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground mt-1", children: "Collect cash from passenger" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-3", children: "Returning to dashboard in a moment..." })
          ]
        }
      ),
      online && hasActiveRide && ride && !showEarnings && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "driver.active_ride_panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: "Active Ride" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RideStatusBadge,
            {
              status: ride.status,
              "data-ocid": "driver.ride_status_badge"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl bg-muted/30 border border-border p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5 text-primary mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Pickup" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children: locationLabel(ride.pickup) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3.5 h-3.5 text-destructive mt-0.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Destination" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-foreground truncate", children: locationLabel(ride.destination) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center border-t border-border pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Fare" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-base text-foreground", children: [
              "KSh ",
              Number(ride.fare)
            ] })
          ] })
        ] }),
        ride.status === RideStatus.Accepted && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full h-11 bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold",
            onClick: handleStartRide,
            disabled: actionLoading === "start",
            "data-ocid": "driver.start_ride_button",
            children: actionLoading === "start" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Start Ride →"
          }
        ),
        ride.status === RideStatus.Ongoing && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full h-11 font-display font-semibold shadow-elevated",
            onClick: handleCompleteRide,
            disabled: actionLoading === "complete",
            "data-ocid": "driver.complete_ride_button",
            children: actionLoading === "complete" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "End Trip — Collect KSh 100"
          }
        )
      ] }),
      showPending && hasPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold text-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-amber-500" }),
          "Incoming requests (",
          pendingRides.length,
          ")"
        ] }),
        pendingRides.slice(0, 3).map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-xl border border-border bg-background p-3 space-y-2",
            "data-ocid": `driver.ride_request.${i + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: locationLabel(r.pickup) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3 h-3 shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: locationLabel(r.destination) })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-bold text-base text-foreground", children: [
                    "KSh ",
                    Number(r.fare)
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Fixed" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    variant: "outline",
                    onClick: () => handleReject(r.id),
                    disabled: actionLoading === r.id,
                    className: "flex-1 border-border text-muted-foreground hover:border-destructive hover:text-destructive",
                    "data-ocid": `driver.reject_button.${i + 1}`,
                    children: "Ignore"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "sm",
                    onClick: () => handleAccept(r.id),
                    disabled: actionLoading === r.id,
                    className: "flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold",
                    "data-ocid": `driver.accept_button.${i + 1}`,
                    children: actionLoading === r.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : "Accept"
                  }
                )
              ] })
            ]
          },
          r.id
        ))
      ] }),
      showPending && !hasPending && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl bg-muted/40 border border-border p-5 text-center",
          "data-ocid": "driver.no_requests_empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl mb-2", children: "🚗" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: "No requests yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: "Waiting for nearby passengers..." })
          ]
        }
      )
    ] })
  ] }) });
}
export {
  DriverPage
};
