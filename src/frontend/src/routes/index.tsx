import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Car, Loader2, MapPin, Shield, Zap } from "lucide-react";
import { useEffect, useRef } from "react";
import { createActor } from "../backend";
import { useAuthStore } from "../store/auth";
import type { User } from "../types";

export function LoginPage() {
  const { login, isLoggingIn, isAuthenticated, identity } =
    useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const fetchedRef = useRef(false);

  // Once actor is ready and authenticated, load user profile
  useEffect(() => {
    if (!isAuthenticated || !actor || isFetching || fetchedRef.current) return;
    fetchedRef.current = true;
    actor
      .getCurrentUser()
      .then((u) => {
        if (u) setUser(u as User);
        // If no profile found, redirect to role-select happens via next effect
      })
      .catch(() => {
        fetchedRef.current = false;
      });
  }, [isAuthenticated, actor, isFetching, setUser]);

  // Redirect once we know state
  useEffect(() => {
    if (!isAuthenticated || !identity) return;
    if (user) {
      // Profile exists — go to correct page
      const to = user.role === "Driver" ? "/driver" : "/passenger";
      navigate({ to });
    } else if (!isFetching && actor && fetchedRef.current) {
      // Actor loaded, fetch done, no profile found
      navigate({ to: "/role-select" });
    }
  }, [user, isAuthenticated, identity, isFetching, actor, navigate]);

  const isLoading =
    isLoggingIn || (isAuthenticated && (isFetching || !fetchedRef.current));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Logo mark */}
        <div className="relative mb-8">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-elevated">
            <Car className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <MapPin className="w-3 h-3 text-accent-foreground" />
          </div>
        </div>

        <h1 className="font-display text-4xl font-bold text-foreground text-center mb-2 tracking-tight">
          KaratinaRide
        </h1>
        <p className="text-muted-foreground text-center text-base font-medium mb-1">
          Campus to Town, Always On Time
        </p>
        <p className="text-muted-foreground text-center text-sm mb-10">
          Fixed fare{" "}
          <strong className="text-foreground font-semibold">KSh 100</strong>{" "}
          every ride
        </p>

        <div className="w-full max-w-sm space-y-4">
          <Button
            className="w-full h-12 font-display font-semibold text-base shadow-elevated"
            onClick={() => login()}
            disabled={isLoading}
            data-ocid="login.primary_button"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                {isLoggingIn ? "Connecting..." : "Loading profile..."}
              </>
            ) : (
              "Sign in with Internet Identity"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground px-4">
            Secure, passwordless login powered by the Internet Computer
          </p>
        </div>
      </div>

      {/* Feature strip */}
      <div className="bg-card border-t border-border py-10 px-6">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            {
              icon: MapPin,
              title: "Live Tracking",
              desc: "Real-time driver location",
              color: "text-primary",
            },
            {
              icon: Shield,
              title: "KSh 100 Flat",
              desc: "No surge pricing ever",
              color: "text-accent",
            },
            {
              icon: Zap,
              title: "Instant Match",
              desc: "Nearest driver assigned",
              color: "text-primary",
            },
          ].map((f) => (
            <div key={f.title} className="space-y-2">
              <div
                className={`w-9 h-9 rounded-xl bg-muted mx-auto flex items-center justify-center ${f.color}`}
              >
                <f.icon className="w-4 h-4" />
              </div>
              <div className="font-display font-semibold text-sm text-foreground">
                {f.title}
              </div>
              <div className="text-xs text-muted-foreground">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-muted/40 border-t border-border py-3 px-4">
        <p className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
