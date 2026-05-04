import { useEffect, useRef } from "react";
import { KARATINA_CAMPUS, KARATINA_TOWN } from "../lib/geo";
import type { Location } from "../types";

interface Props {
  pickupLocation?: Location | null;
  destinationLocation?: Location | null;
  driverLocation?: Location | null;
  showCampus?: boolean;
  showTown?: boolean;
  className?: string;
}

// Map bounding box around Karatina area
const MAP_BOUNDS = {
  minLat: -0.5,
  maxLat: -0.46,
  minLng: 37.13,
  maxLng: 37.17,
};

function latLngToCanvas(
  loc: Location,
  width: number,
  height: number,
): { x: number; y: number } {
  const x =
    ((loc.lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
    width;
  const y =
    ((MAP_BOUNDS.maxLat - loc.lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
    height;
  return { x, y };
}

function drawMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  label: string,
  pulse = false,
) {
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

function drawRoad(
  ctx: CanvasRenderingContext2D,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 4;
  ctx.setLineDash([8, 4]);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function MapCanvas({
  pickupLocation,
  destinationLocation,
  driverLocation,
  showCampus = true,
  showTown = true,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = canvas;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#f0f4f8");
    grad.addColorStop(1, "#e8f0fe");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Grid lines for map feel
    ctx.strokeStyle = "#dde3ea";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      const xi = (width / 8) * i;
      ctx.beginPath();
      ctx.moveTo(xi, 0);
      ctx.lineTo(xi, height);
      ctx.stroke();
    }
    for (let j = 0; j <= 6; j++) {
      const yj = (height / 6) * j;
      ctx.beginPath();
      ctx.moveTo(0, yj);
      ctx.lineTo(width, yj);
      ctx.stroke();
    }

    // Main road
    const campusPx = latLngToCanvas(KARATINA_CAMPUS, width, height);
    const townPx = latLngToCanvas(KARATINA_TOWN, width, height);
    ctx.beginPath();
    ctx.moveTo(campusPx.x, campusPx.y);
    ctx.lineTo(townPx.x, townPx.y);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 6;
    ctx.setLineDash([]);
    ctx.stroke();

    // Dashed route between pickup and destination
    if (pickupLocation && destinationLocation) {
      const pickPx = latLngToCanvas(pickupLocation, width, height);
      const destPx = latLngToCanvas(destinationLocation, width, height);
      drawRoad(ctx, pickPx, destPx);
    }

    // Reference locations
    if (showCampus)
      drawMarker(ctx, campusPx.x, campusPx.y, "#3b82f6", "Campus");
    if (showTown) drawMarker(ctx, townPx.x, townPx.y, "#22c55e", "Town");

    // Pickup marker (purple)
    if (pickupLocation) {
      const px = latLngToCanvas(pickupLocation, width, height);
      drawMarker(ctx, px.x, px.y, "#a855f7", "Pickup");
    }

    // Destination marker (red)
    if (destinationLocation) {
      const dx = latLngToCanvas(destinationLocation, width, height);
      drawMarker(ctx, dx.x, dx.y, "#ef4444", "Dest");
    }

    // Driver marker (orange, pulsing)
    if (driverLocation) {
      const dp = latLngToCanvas(driverLocation, width, height);
      drawMarker(ctx, dp.x, dp.y, "#f97316", "Driver", true);
    }

    // Legend
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
      { color: "#ef4444", label: "Destination" },
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
    showTown,
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={320}
      className={`w-full h-full rounded-xl ${className}`}
      aria-label="Karatina area map"
    />
  );
}
