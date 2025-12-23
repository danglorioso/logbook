"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plane } from "lucide-react";

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
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong. Please try again.");
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
      // Attempt verification with the code
      const signInAttempt = await signIn.attemptFirstFactor({
        strategy: "email_code",
        code,
      });

      if (signInAttempt.status === "complete") {
        // Set the session as active and redirect
        await setActive({ session: signInAttempt.createdSessionId });
        router.push("/profile");
      } else {
        setError("Verification incomplete. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 justify-center mb-8">
            <Plane className="h-8 w-8" />
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
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
        <div className="flex items-center gap-2 justify-center mb-8">
          <Plane className="h-8 w-8" />
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
              <Button type="submit" className="w-full" disabled={loading || !isLoaded}>
                {loading ? "Sending..." : "Send Verification Code"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-white/60">
              Don't have an account?{" "}
              <Link href="/register" className="text-white hover:underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
