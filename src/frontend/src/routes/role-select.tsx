import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Bus, Car, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createActor } from "../backend";
import { Role } from "../backend";
import { useAuthStore } from "../store/auth";
import type { User as UserType } from "../types";

export function RoleSelectPage() {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const { actor } = useActor(createActor);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister() {
    if (!actor || !role || !name.trim() || !phone.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await actor.registerUser(name.trim(), phone.trim(), role);
      if (result.__kind__ === "ok") {
        const newUser = result.ok as UserType;
        setUser(newUser);
        toast.success("Account created! Welcome aboard.");
        // Use the stored role value directly for navigation decision
        const isDriver = role === Role.Driver;
        navigate({ to: isDriver ? "/driver" : "/passenger" });
      } else {
        setError(result.err);
        toast.error(result.err);
      }
    } catch (_e) {
      const msg = "Registration failed. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit =
    !loading && !!role && name.trim().length > 0 && phone.trim().length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header strip */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Car className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-display font-bold text-sm text-foreground leading-none">
              KaratinaRide
            </div>
            <div className="font-display text-xs text-muted-foreground leading-none">
              New account
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-1">
            Create your account
          </h1>
          <p className="text-muted-foreground text-center text-sm mb-8">
            Tell us who you are to get started
          </p>

          <div className="bg-card rounded-2xl border border-border shadow-card p-6 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                placeholder="e.g. James Mwangi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                data-ocid="role_select.name_input"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                data-ocid="role_select.phone_input"
              />
            </div>

            {/* Role selection */}
            <div className="space-y-2">
              <Label>I want to…</Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Passenger card */}
                <button
                  type="button"
                  onClick={() => setRole(Role.Passenger)}
                  disabled={loading}
                  className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-smooth ${
                    role === Role.Passenger
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-muted/40"
                  }`}
                  data-ocid="role_select.passenger_button"
                >
                  <Bus
                    className={`w-8 h-8 ${
                      role === Role.Passenger
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-center">
                    <div className="font-semibold text-sm text-foreground">
                      Ride
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Passenger
                    </div>
                  </div>
                </button>

                {/* Driver card */}
                <button
                  type="button"
                  onClick={() => setRole(Role.Driver)}
                  disabled={loading}
                  className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 transition-smooth ${
                    role === Role.Driver
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/40 hover:bg-muted/40"
                  }`}
                  data-ocid="role_select.driver_button"
                >
                  <Car
                    className={`w-8 h-8 ${
                      role === Role.Driver
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  />
                  <div className="text-center">
                    <div className="font-semibold text-sm text-foreground">
                      Drive
                    </div>
                    <div className="text-xs text-muted-foreground">Driver</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive"
                data-ocid="role_select.error_state"
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="button"
              className="w-full h-11 font-display font-semibold"
              onClick={handleRegister}
              disabled={!canSubmit}
              data-ocid="role_select.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Continue →"
              )}
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            You can change your role by contacting support.
          </p>
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
