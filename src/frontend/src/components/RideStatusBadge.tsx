import { RideStatus } from "../backend";

interface Props {
  status: RideStatus;
  className?: string;
}

const STATUS_CONFIG: Record<RideStatus, { label: string; className: string }> =
  {
    [RideStatus.Searching]: {
      label: "Searching",
      className: "status-searching",
    },
    [RideStatus.Accepted]: { label: "Accepted", className: "status-accepted" },
    [RideStatus.Ongoing]: { label: "Ongoing", className: "status-ongoing" },
    [RideStatus.Completed]: {
      label: "Completed",
      className: "status-completed",
    },
    [RideStatus.Cancelled]: {
      label: "Cancelled",
      className:
        "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-900",
    },
  };

export function RideStatusBadge({ status, className = "" }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`${config.className} ${className}`}>{config.label}</span>
  );
}
