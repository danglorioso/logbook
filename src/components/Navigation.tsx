"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { AnimatedPlane } from "@/components/AnimatedPlane";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const { user, isLoaded: userLoaded } = useUser();
  const { signOut } = useClerk();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  const isLoggedIn = userLoaded && user;

  const navLinks = isLoggedIn ? (
    <>
      <Link
        href="/"
        onClick={() => setMobileMenuOpen(false)}
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
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          pathname === "/public"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5"
        )}
      >
        Community Flights
      </Link>
      <Link
        href="/profile"
        onClick={() => setMobileMenuOpen(false)}
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
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          pathname === "/about"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5"
        )}
      >
        About
      </Link>
    </>
  ) : (
    <>
      <Link
        href="/public"
        onClick={() => setMobileMenuOpen(false)}
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
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "px-4 py-2 rounded-md text-sm font-medium transition-colors",
          pathname === "/about"
            ? "bg-white/10 text-white"
            : "text-white/60 hover:text-white hover:bg-white/5"
        )}
      >
        About
      </Link>
    </>
  );

  return (
    <nav className="border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <AnimatedPlane size="sm" />
            <span className="text-xl font-semibold">Logbook</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                {/* Navigation Tabs */}
                <div className="flex items-center gap-1">
                  {navLinks}
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
              </>
            ) : (
              <>
                <div className="flex items-center gap-1">
                  {navLinks}
                </div>
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
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/60 hover:text-white hover:bg-white/5 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-white/10 pt-4">
            <div className="flex flex-col space-y-2">
              {navLinks}
            </div>
            {isLoggedIn ? (
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full border-white/30 text-white hover:bg-white/10 mt-4"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-white/30 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

