import { Skeleton } from "@/components/ui/skeleton";
import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Suspense, lazy } from "react";
import { LoginPage } from "./routes/index";

const RoleSelectPage = lazy(() =>
  import("./routes/role-select").then((m) => ({ default: m.RoleSelectPage })),
);
const PassengerPage = lazy(() =>
  import("./routes/passenger").then((m) => ({ default: m.PassengerPage })),
);
const DriverPage = lazy(() =>
  import("./routes/driver").then((m) => ({ default: m.DriverPage })),
);

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col gap-4 p-6">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="flex-1 w-full" />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

const roleSelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/role-select",
  component: RoleSelectPage,
});

const passengerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/passenger",
  component: PassengerPage,
});

const driverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/driver",
  component: DriverPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  roleSelectRoute,
  passengerRoute,
  driverRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
