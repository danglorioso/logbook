"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { AnimatedPlane } from "@/components/AnimatedPlane";

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded || !signIn) return;

    setLoading(true);
    setError("");

    try {
      // Start the sign-in process using email
      const result = await signIn.create({
        identifier: email,
      });

      // Get the email address ID from the supported first factors
      const emailFactor = result.supportedFirstFactors?.find(
        (factor) => factor.strategy === "email_code"
      ) as { strategy: "email_code"; emailAddressId: string } | undefined;

      if (!emailFactor || !emailFactor.emailAddressId) {
        throw new Error("Email code verification not available");
      }

      // Prepare email code verification - sends OTP to email
      await signIn.prepareFirstFactor({
        strategy: "email_code",
        emailAddressId: emailFactor.emailAddressId,
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
    if (!isLoaded || !signIn) return;

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
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code: cleanCode,
      });

      console.log("Sign-in attempt result:", {
        status: signInAttempt.status,
        createdSessionId: signInAttempt.createdSessionId,
      });

      if (signInAttempt.status === "complete") {
        // Set the session as active and redirect
        if (signInAttempt.createdSessionId) {
          await setActive({ session: signInAttempt.createdSessionId });
          router.push("/profile");
        } else {
          setError("Session creation failed. Please try again.");
        }
      } else {
        // Log the status for debugging
        console.log("Sign-in status:", signInAttempt.status);
        console.log("Sign-in attempt:", signInAttempt);
        setError(`Verification incomplete. Status: ${signInAttempt.status}. Please check the code and try again.`);
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
      <div className="min-h-screen bg-black text-white flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
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
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 justify-center mb-8 group">
            <AnimatedPlane size="md" />
            <span className="text-2xl font-semibold">Logbook</span>
          </div>
          <Card className="bg-[#0a0a0a] border-white/10">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Sign In</CardTitle>
              <CardDescription className="text-center text-white/60">
                Enter your email to receive a verification code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
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
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-white hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
