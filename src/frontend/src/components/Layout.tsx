import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Car, LogOut, User } from "lucide-react";
import type { ReactNode } from "react";
import { Role } from "../backend";
import { useAuthStore } from "../store/auth";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const { user, logout } = useAuthStore();
  const { clear } = useInternetIdentity();

  function handleLogout() {
    clear();
    logout();
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Car className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-display font-bold text-sm text-foreground leading-none">
                Karatina
              </div>
              <div className="font-display text-xs text-muted-foreground leading-none">
                Rides
              </div>
            </div>
          </div>

          {/* Right side */}
          {user && (
            <div className="flex items-center gap-3">
              <span
                className={
                  user.role === Role.Passenger
                    ? "role-passenger"
                    : "role-driver"
                }
                data-ocid="layout.role_badge"
              >
                {user.role === Role.Passenger ? "Passenger" : "Driver"}
              </span>
              <div className="flex items-center gap-1.5 text-sm text-foreground">
                <User className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="font-medium truncate max-w-[120px]">
                  {user.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive transition-colors"
                data-ocid="layout.logout_button"
              >
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>

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
