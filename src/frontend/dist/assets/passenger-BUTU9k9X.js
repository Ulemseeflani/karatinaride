import { c as createLucideIcon, d as useAuthStore, e as useActor, u as useNavigate, r as reactExports, h as RideStatus, j as jsxRuntimeExports, M as MapPin, L as LoaderCircle, B as Button, f as ue, g as createActor } from "./index-IFpQRH9a.js";
import { u as useRideStore, a as useGeoLocation, b as usePolling, K as KARATINA_TOWN, c as KARATINA_CAMPUS, L as Layout, M as MapCanvas, l as locationLabel, N as Navigation, R as RideStatusBadge, U as User, C as CircleCheckBig } from "./ride-Czj81qtu.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "12 2 19 21 12 17 5 21 12 2", key: "x8c0qg" }]
];
const Navigation2 = createLucideIcon("navigation-2", __iconNode);
const DESTINATIONS = [
  { label: "Karatina Town Center", loc: KARATINA_TOWN },
  { label: "Karatina University - Main Gate", loc: KARATINA_CAMPUS }
];
function StatusBanner({ status }) {
  if (status === RideStatus.Searching) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-[color:var(--chart-3)]/30 bg-[color:var(--chart-3)]/10 p-3 flex items-center gap-2.5",
        "data-ocid": "passenger.searching_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-[color:var(--chart-3)] shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: "Looking for your driver..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Usually takes under 2 minutes" })
          ] })
        ]
      }
    );
  }
  if (status === RideStatus.Accepted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 p-3 flex items-center gap-2.5",
        "data-ocid": "passenger.accepted_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation2, { className: "w-4 h-4 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: "Driver is on the way!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Your driver has accepted the ride" })
          ] })
        ]
      }
    );
  }
  if (status === RideStatus.Ongoing) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-[color:var(--primary)]/30 bg-[color:var(--primary)]/10 p-3 flex items-center gap-2.5",
        "data-ocid": "passenger.ongoing_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-4 h-4 text-primary animate-pulse shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: "You are on your way!" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Enjoy the ride" })
          ] })
        ]
      }
    );
  }
  if (status === RideStatus.Completed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 p-3 flex items-center gap-2.5",
        "data-ocid": "passenger.completed_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-accent shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-sm text-foreground", children: "Arrived! Trip complete. 🎉" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Please pay your driver KSh 100 cash" })
          ] })
        ]
      }
    );
  }
  return null;
}
function PassengerPage() {
  const { user } = useAuthStore();
  const { ride, setRide, driverInfo, setDriverInfo, clearRide } = useRideStore();
  const { actor } = useActor(createActor);
  const { coords, loading: gpsLoading, error: gpsError } = useGeoLocation();
  const navigate = useNavigate();
  const [pickup, setPickup] = reactExports.useState(null);
  const [destIndex, setDestIndex] = reactExports.useState(0);
  const [requesting, setRequesting] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!user) navigate({ to: "/" });
    else if (user.role !== "Passenger") navigate({ to: "/driver" });
  }, [user, navigate]);
  reactExports.useEffect(() => {
    if (coords) setPickup(coords);
  }, [coords]);
  const { data: activeRide } = usePolling(
    async () => {
      if (!actor) return null;
      return actor.getMyActiveRide();
    },
    2e3,
    !!actor
  );
  reactExports.useEffect(() => {
    if (activeRide !== void 0) setRide(activeRide);
  }, [activeRide, setRide]);
  const { data: drivers } = usePolling(
    async () => {
      if (!actor || !(ride == null ? void 0 : ride.driverId)) return [];
      return actor.getOnlineDrivers();
    },
    3e3,
    !!actor && !!(ride == null ? void 0 : ride.driverId)
  );
  reactExports.useEffect(() => {
    var _a;
    if (!drivers || !(ride == null ? void 0 : ride.driverId)) return;
    const dId = (_a = ride.driverId) == null ? void 0 : _a.toString();
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
        setRide(result.ok);
        ue.success("Ride requested! Finding a driver...");
      } else {
        ue.error(result.err);
      }
    } catch {
      ue.error("Failed to request ride.");
    } finally {
      setRequesting(false);
    }
  }
  async function handleCancelRide() {
    if (!actor || !ride) return;
    try {
      await actor.cancelRide(ride.id);
      clearRide();
      ue.success("Ride cancelled.");
    } catch {
      ue.error("Failed to cancel ride.");
    }
  }
  const hasActiveRide = !!ride && ride.status !== RideStatus.Completed && ride.status !== RideStatus.Cancelled;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 min-h-[320px] bg-muted/30 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MapCanvas,
      {
        pickupLocation: pickup,
        destinationLocation: destination,
        driverLocation: driverInfo == null ? void 0 : driverInfo.lastLocation,
        showCampus: true,
        showTown: true,
        className: "shadow-card"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border-t border-border p-4 space-y-4", children: !hasActiveRide ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-primary" }),
          " Pickup Location"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-lg border border-input bg-muted/30 px-3 py-2.5 text-sm text-foreground min-h-[40px] flex items-center",
            "data-ocid": "passenger.pickup_input",
            children: gpsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3 h-3 animate-spin" }),
              " Detecting GPS location..."
            ] }) : gpsError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-xs", children: [
              "📍",
              " ",
              pickup ? locationLabel(pickup) : "Karatina University - Main Gate"
            ] }) : pickup ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" }),
              locationLabel(pickup)
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Waiting for GPS..." })
          }
        ),
        gpsError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "⚠️ ",
          gpsError
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "w-3 h-3 text-primary" }),
          " Destination"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: DESTINATIONS.map((d, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setDestIndex(i),
            className: `rounded-lg border px-3 py-2.5 text-xs text-left transition-smooth ${destIndex === i ? "border-primary bg-primary/5 font-semibold text-primary" : "border-border hover:border-primary/40 text-foreground"}`,
            "data-ocid": `passenger.destination_button.${i + 1}`,
            children: d.label
          },
          d.label
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full h-12 font-display font-semibold text-base shadow-elevated",
          onClick: handleRequestRide,
          disabled: !pickup || requesting,
          "data-ocid": "passenger.request_ride_button",
          children: requesting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
            "Finding driver..."
          ] }) : "Request Ride — KSh 100"
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mb-1", children: "Ride status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            RideStatusBadge,
            {
              status: ride.status,
              "data-ocid": "passenger.ride_status_badge"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Fare" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-display font-bold text-xl text-foreground", children: [
            "KSh ",
            Number(ride.fare)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBanner, { status: ride.status }),
      (ride.status === RideStatus.Accepted || ride.status === RideStatus.Ongoing) && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl bg-muted/30 border border-border p-3 flex items-center gap-3",
          "data-ocid": "passenger.driver_info_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-foreground truncate", children: "Your Driver" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: (driverInfo == null ? void 0 : driverInfo.lastLocation) ? `📍 ${locationLabel(driverInfo.lastLocation)}` : "Heading your way" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: "Fare" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-sm text-foreground", children: "KSh 100" })
            ] })
          ]
        }
      ),
      ride.status === RideStatus.Completed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 p-4 space-y-2",
          "data-ocid": "passenger.trip_summary_card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-bold text-base text-foreground", children: "Trip Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-accent" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "From" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: locationLabel(ride.pickup) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "To" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: locationLabel(ride.destination) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm border-t border-border pt-1 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Total Fare (Cash)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-foreground", children: [
                  "KSh ",
                  Number(ride.fare)
                ] })
              ] })
            ] })
          ]
        }
      ),
      (ride.status === RideStatus.Searching || ride.status === RideStatus.Accepted) && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground",
          onClick: handleCancelRide,
          "data-ocid": "passenger.cancel_ride_button",
          children: "Cancel Ride"
        }
      ),
      ride.status === RideStatus.Completed && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          className: "w-full font-display font-semibold",
          onClick: () => clearRide(),
          "data-ocid": "passenger.new_ride_button",
          children: "Book Another Ride"
        }
      )
    ] }) })
  ] }) });
}
export {
  PassengerPage
};
