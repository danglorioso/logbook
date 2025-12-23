"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AnimatedPlane } from "@/components/AnimatedPlane";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const isLoggedIn = userLoaded && user;

  return (
    <nav className="border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <AnimatedPlane size="sm" />
            <span className="text-xl font-semibold">Logbook</span>
          </Link>

          {isLoggedIn ? (
            <div className="flex items-center gap-6">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/"
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  My Flights
                </Link>
                <Link
                  href="/public"
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/public"
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  Recent Flights
                </Link>
                <Link
                  href="/profile"
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/profile"
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  Profile
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/about"
                      ? "bg-white/10 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                >
                  About
                </Link>
              </div>

              {/* Sign Out Button */}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              {/* Recent Flights Tab for non-logged-in users */}
              <Link
                href="/public"
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/public"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                Recent Flights
              </Link>
              <Link
                href="/about"
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === "/about"
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                )}
              >
                About
              </Link>
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

