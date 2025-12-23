"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedPlane } from "@/components/AnimatedPlane";

export default function RegisterPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setError("");

    try {
      // Start the sign-up process
      await signUp.create({
        emailAddress: email,
        username: username,
      });

      // Prepare email code verification - sends OTP to email
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setVerifying(true);
    } catch (err) {
      const error = err as { errors?: Array<{ message?: string }>; message?: string };
      setError(error.errors?.[0]?.message || error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;

    setLoading(true);
    setError("");

    try {
      // Trim and clean the code
      const cleanCode = code.trim().replace(/\s/g, "");
      
      if (!cleanCode || cleanCode.length < 6) {
        setError("Please enter a valid 6-digit code");
        setLoading(false);
        return;
      }

      // Attempt verification with the code
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: cleanCode,
      });

      console.log("Sign-up attempt result:", {
        status: signUpAttempt.status,
        createdSessionId: signUpAttempt.createdSessionId,
        createdUserId: signUpAttempt.createdUserId,
      });

      if (signUpAttempt.status === "complete") {
        // Set the session as active and redirect
        if (signUpAttempt.createdSessionId) {
          await setActive({ session: signUpAttempt.createdSessionId });
          // Sync username to database
          try {
            await fetch("/api/users/sync", { method: "POST" });
          } catch (syncError) {
            console.error("Failed to sync user:", syncError);
            // Continue anyway - sync is not critical
          }
          router.push("/profile");
        } else {
          setError("Session creation failed. Please try signing in.");
        }
      } else if (signUpAttempt.status === "missing_requirements") {
        // Check what's missing
        const missingFields = signUpAttempt.missingFields || [];
        const unverifiedFields = signUpAttempt.unverifiedFields || [];
        
        console.log("Missing fields:", missingFields);
        console.log("Unverified fields:", unverifiedFields);
        console.log("Full sign-up attempt:", JSON.stringify(signUpAttempt, null, 2));
        
        // If email is verified and user was created, try to activate the session
        if (!unverifiedFields.includes("email_address") && signUpAttempt.createdUserId) {
          // Email is verified and user exists, try to activate session
          if (signUpAttempt.createdSessionId) {
            try {
              await setActive({ session: signUpAttempt.createdSessionId });
              // Sync username to database
              try {
                await fetch("/api/users/sync", { method: "POST" });
              } catch (syncError) {
                console.error("Failed to sync user:", syncError);
                // Continue anyway - sync is not critical
              }
              router.push("/profile");
            } catch (activeErr) {
              const activeError = activeErr as { errors?: Array<{ message?: string }>; message?: string };
              console.error("Set active error:", activeError);
              // If setting active fails, the user was created, so redirect to login
              setError("Account created successfully! Please sign in with your email.");
              setTimeout(() => {
                router.push("/login");
              }, 2000);
            }
          } else {
            // User was created but no session - they need to sign in
            setError("Account created successfully! Please sign in with your email.");
            setTimeout(() => {
              router.push("/login");
            }, 2000);
          }
        } else {
          // Email verification might have failed or other requirements missing
          setError(`Verification incomplete. Missing: ${missingFields.join(", ") || "unknown requirements"}. Please check the code and try again.`);
        }
      } else {
        // Log the status for debugging
        console.log("Sign-up status:", signUpAttempt.status);
        console.log("Sign-up attempt:", signUpAttempt);
        setError(`Verification incomplete. Status: ${signUpAttempt.status}. Please check the code and try again.`);
      }
    } catch (err) {
      const error = err as { errors?: Array<{ message?: string }>; message?: string; status?: string };
      console.error("Verification error:", err);
      console.error("Error details:", {
        errors: error.errors,
        message: error.message,
        status: error.status,
      });
      // Show more detailed error message
      const errorMessage = error.errors?.[0]?.message || error.message || "Invalid code. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 justify-center mb-8 group">
            <AnimatedPlane size="md" />
            <span className="text-2xl font-semibold">Logbook</span>
          </div>
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
              <CardDescription className="text-center text-white/60">
                Enter the code sent to {email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerification} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="bg-black border-white/10"
                    maxLength={6}
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg disabled:opacity-50" 
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                  onClick={() => setVerifying(false)}
                >
                  Back
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 justify-center mb-8 group">
          <AnimatedPlane size="md" />
          <span className="text-2xl font-semibold">Logbook</span>
        </div>
        <Card className="bg-[#0a0a0a] border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-white/60">
              Enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder=""
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-black border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black border-white/10"
                />
              </div>
              {error && (
                <p className="text-sm text-red-400">{error}</p>
              )}
              {/* Clerk CAPTCHA element */}
              <div id="clerk-captcha" className="flex justify-center my-4"></div>
              <Button 
                type="submit" 
                className="w-full bg-white text-black font-semibold hover:bg-white/90 shadow-md hover:shadow-lg disabled:opacity-50" 
                disabled={loading || !isLoaded}
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-white/60">
              Already have an account?{" "}
              <Link href="/login" className="text-white hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

