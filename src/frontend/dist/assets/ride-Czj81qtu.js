import { c as createLucideIcon, d as useAuthStore, i as useInternetIdentity, j as jsxRuntimeExports, C as Car, R as Role, B as Button, r as reactExports, h as RideStatus, k as create } from "./index-IFpQRH9a.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
  ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
];
const CircleCheckBig = createLucideIcon("circle-check-big", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
  ["path", { d: "M21 12H9", key: "dn1m92" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }]
];
const LogOut = createLucideIcon("log-out", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["polygon", { points: "3 11 22 2 13 21 11 13 3 11", key: "1ltx0t" }]
];
const Navigation = createLucideIcon("navigation", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const { clear } = useInternetIdentity();
  function handleLogout() {
    clear();
    logout();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 bg-card border-b border-border shadow-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 h-14 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Car, { className: "w-4 h-4 text-primary-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display font-bold text-sm text-foreground leading-none", children: "Karatina" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-display text-xs text-muted-foreground leading-none", children: "Rides" })
        ] })
      ] }),
      user && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: user.role === Role.Passenger ? "role-passenger" : "role-driver",
            "data-ocid": "layout.role_badge",
            children: user.role === Role.Passenger ? "Passenger" : "Driver"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium truncate max-w-[120px]", children: user.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            onClick: handleLogout,
            className: "text-muted-foreground hover:text-destructive transition-colors",
            "data-ocid": "layout.logout_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Logout" })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 flex flex-col", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "bg-muted/40 border-t border-border py-3 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ". Built with love using",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`,
          target: "_blank",
          rel: "noreferrer",
          className: "underline hover:text-foreground transition-colors",
          children: "caffeine.ai"
        }
      )
    ] }) })
  ] });
}
const KARATINA_CAMPUS = {
  lat: -0.4848,
  lng: 37.1456
};
const KARATINA_TOWN = {
  lat: -0.4819,
  lng: 37.1529
};
function watchPosition(onUpdate, onError) {
  if (!navigator.geolocation) {
    return -1;
  }
  return navigator.geolocation.watchPosition(
    (pos) => {
      onUpdate({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    },
    () => {
    },
    { enableHighAccuracy: true, maximumAge: 3e3, timeout: 1e4 }
  );
}
function clearWatch(watchId) {
  if (watchId >= 0) navigator.geolocation.clearWatch(watchId);
}
function calculateDistance(a, b) {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const c = 2 * Math.atan2(
    Math.sqrt(
      sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng
    ),
    Math.sqrt(
      1 - sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng
    )
  );
  return R * c;
}
function toRad(deg) {
  return deg * Math.PI / 180;
}
function locationLabel(loc) {
  const campusDist = calculateDistance(loc, KARATINA_CAMPUS);
  const townDist = calculateDistance(loc, KARATINA_TOWN);
  if (campusDist < 0.5) return "Karatina University - Main Gate";
  if (townDist < 0.5) return "Karatina Town Center";
  return `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`;
}
const MAP_BOUNDS = {
  minLat: -0.5,
  maxLat: -0.46,
  minLng: 37.13,
  maxLng: 37.17
};
function latLngToCanvas(loc, width, height) {
  const x = (loc.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng) * width;
  const y = (MAP_BOUNDS.maxLat - loc.lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat) * height;
  return { x, y };
}
function drawMarker(ctx, x, y, color, label, pulse = false) {
  if (pulse) {
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fillStyle = `${color}33`;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, 8, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y - 14);
}
function drawRoad(ctx, from, to) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
}
function MapCanvas({
  pickupLocation,
  destinationLocation,
  driverLocation,
  showCampus = true,
  showTown = true,
  className = ""
}) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#f0f4f8");
    grad.addColorStop(1, "#e8f0fe");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#dde3ea";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const xi = width / 8 * i;
      ctx.beginPath();
      ctx.moveTo(xi, 0);
      ctx.lineTo(xi, height);
      ctx.stroke();
    }
    for (let j = 0; j <= 6; j++) {
      const yj = height / 6 * j;
      ctx.beginPath();
      ctx.moveTo(0, yj);
      ctx.lineTo(width, yj);
      ctx.stroke();
    }
    const campusPx = latLngToCanvas(KARATINA_CAMPUS, width, height);
    const townPx = latLngToCanvas(KARATINA_TOWN, width, height);
    ctx.beginPath();
    ctx.moveTo(campusPx.x, campusPx.y);
    ctx.lineTo(townPx.x, townPx.y);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 6;
    ctx.setLineDash([]);
    ctx.stroke();
    if (pickupLocation && destinationLocation) {
      const pickPx = latLngToCanvas(pickupLocation, width, height);
      const destPx = latLngToCanvas(destinationLocation, width, height);
      drawRoad(ctx, pickPx, destPx);
    }
    if (showCampus)
      drawMarker(ctx, campusPx.x, campusPx.y, "#3b82f6", "Campus");
    if (showTown) drawMarker(ctx, townPx.x, townPx.y, "#22c55e", "Town");
    if (pickupLocation) {
      const px = latLngToCanvas(pickupLocation, width, height);
      drawMarker(ctx, px.x, px.y, "#a855f7", "Pickup");
    }
    if (destinationLocation) {
      const dx = latLngToCanvas(destinationLocation, width, height);
      drawMarker(ctx, dx.x, dx.y, "#ef4444", "Dest");
    }
    if (driverLocation) {
      const dp = latLngToCanvas(driverLocation, width, height);
      drawMarker(ctx, dp.x, dp.y, "#f97316", "Driver", true);
    }
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.roundRect(8, height - 80, 140, 72, 8);
    ctx.fill();
    ctx.fillStyle = "#64748b";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "left";
    const legend = [
      { color: "#3b82f6", label: "Campus" },
      { color: "#22c55e", label: "Town" },
      { color: "#a855f7", label: "Pickup" },
      { color: "#ef4444", label: "Destination" }
    ];
    legend.forEach((item, i) => {
      const ly = height - 70 + i * 16;
      ctx.beginPath();
      ctx.arc(20, ly, 4, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.fillStyle = "#334155";
      ctx.fillText(item.label, 30, ly + 4);
    });
  }, [
    pickupLocation,
    destinationLocation,
    driverLocation,
    showCampus,
    showTown
  ]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: 600,
      height: 320,
      className: `w-full h-full rounded-xl ${className}`,
      "aria-label": "Karatina area map"
    }
  );
}
const STATUS_CONFIG = {
  [RideStatus.Searching]: {
    label: "Searching",
    className: "status-searching"
  },
  [RideStatus.Accepted]: { label: "Accepted", className: "status-accepted" },
  [RideStatus.Ongoing]: { label: "Ongoing", className: "status-ongoing" },
  [RideStatus.Completed]: {
    label: "Completed",
    className: "status-completed"
  },
  [RideStatus.Cancelled]: {
    label: "Cancelled",
    className: "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-900"
  }
};
function RideStatusBadge({ status, className = "" }) {
  const config = STATUS_CONFIG[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${config.className} ${className}`, children: config.label });
}
function useGeoLocation() {
  const [state, setState] = reactExports.useState({
    coords: null,
    error: null,
    loading: true
  });
  reactExports.useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coords: KARATINA_CAMPUS,
        error: "Geolocation not supported — using campus as default",
        loading: false
      });
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          coords: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          error: null,
          loading: false
        });
      },
      () => {
        setState({
          coords: KARATINA_CAMPUS,
          error: "Location unavailable — using campus as default",
          loading: false
        });
      },
      { enableHighAccuracy: true, maximumAge: 3e3, timeout: 1e4 }
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  return state;
}
function usePolling(fn, intervalMs, enabled = true) {
  const [state, setState] = reactExports.useState({
    data: null,
    error: null,
    loading: true
  });
  const fnRef = reactExports.useRef(fn);
  fnRef.current = fn;
  const run = reactExports.useCallback(async () => {
    try {
      const data = await fnRef.current();
      setState({ data, error: null, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Polling error";
      setState((prev) => ({ ...prev, error: msg, loading: false }));
    }
  }, []);
  reactExports.useEffect(() => {
    if (!enabled) return;
    run();
    const id = setInterval(run, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs, run]);
  return state;
}
const useRideStore = create((set) => ({
  ride: null,
  driverInfo: null,
  pendingRides: [],
  setRide: (ride) => set({ ride }),
  setDriverInfo: (driverInfo) => set({ driverInfo }),
  setPendingRides: (pendingRides) => set({ pendingRides }),
  clearRide: () => set({ ride: null, driverInfo: null })
}));
export {
  CircleCheckBig as C,
  KARATINA_TOWN as K,
  Layout as L,
  MapCanvas as M,
  Navigation as N,
  RideStatusBadge as R,
  User as U,
  useGeoLocation as a,
  usePolling as b,
  KARATINA_CAMPUS as c,
  clearWatch as d,
  locationLabel as l,
  useRideStore as u,
  watchPosition as w
};
