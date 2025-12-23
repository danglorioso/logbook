"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ProfileFormSkeleton } from "@/components/skeletons/ProfileFormSkeleton";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  firstName: string | null;
  lastName: string | null;
  disabled: boolean;
}

export default function ProfilePage() {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    disabled: false,
  });

  useEffect(() => {
    if (userLoaded && clerkUser) {
      fetchProfile();
    } else if (userLoaded && !clerkUser) {
      router.push("/login");
    }
  }, [userLoaded, clerkUser, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFormData({
          username: data.name || "",
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          disabled: data.disabled || false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username || null,
          firstName: formData.firstName || null,
          lastName: formData.lastName || null,
          disabled: formData.disabled,
        }),
      });

      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        const error = await res.json();
        setMessage({ type: "error", text: error.error || "Failed to update profile" });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  if (!userLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (!clerkUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

          {loading ? (
            <ProfileFormSkeleton />
          ) : (
            <>
              {message && (
                <Alert className={`mb-6 ${message.type === "success" ? "bg-green-500/10 border-green-500/50" : "bg-red-500/10 border-red-500/50"}`}>
                  <div className="flex items-center gap-2">
                    {message.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    )}
                    <AlertDescription className={message.type === "success" ? "text-green-400" : "text-red-400"}>
                      {message.text}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <Card className="bg-[#0a0a0a] border-white/10">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription className="text-white/60">
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={clerkUser.primaryEmailAddress?.emailAddress || ""}
                        disabled
                        className="bg-black/50 border-white/10 text-white/60"
                      />
                      <p className="text-xs text-white/40">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="Choose a username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="bg-black border-white/10"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="bg-black border-white/10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="bg-black border-white/10"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <Label htmlFor="disabled" className="text-base">Disable Account</Label>
                        <p className="text-sm text-white/60 mt-1">
                          Disabling your account will prevent you from logging in
                        </p>
                      </div>
                      <input
                        id="disabled"
                        type="checkbox"
                        checked={formData.disabled}
                        onChange={(e) => setFormData({ ...formData, disabled: e.target.checked })}
                        className="w-5 h-5 rounded border-white/30 bg-black text-white focus:ring-2 focus:ring-white/20"
                      />
                    </div>

                    <div className="flex gap-4 pt-4 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/")}
                        className="border-white/30 text-white hover:bg-white/10"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={saving}
                        className="bg-white text-black hover:bg-white/90 shadow-md hover:shadow-lg"
                      >
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

