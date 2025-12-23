"use client";

import { Navigation } from "@/components/Navigation";
import Footer from "@/components/Footer";
import { AnimatedPlane } from "@/components/AnimatedPlane";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navigation />

      <div className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <AnimatedPlane size="lg" />
              <span className="text-4xl font-semibold">Logbook</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">About</h1>
            <p className="text-xl text-white/60">
              A flight simulator logbook built for the community
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-white/90">
                    Hi, I&apos;m <Link href="https://danglorioso.com" target="_blank" rel="noopener noreferrer" className="text-white underline decoration-white/30 hover:decoration-white/60">Dan Glorioso</Link>, and I&apos;ve been passionate about flight simulation for years. Like many flight sim enthusiasts, I&apos;ve spent countless hours exploring virtual skies, practicing procedures, and experiencing the thrill of aviation from my computer.
                  </p>

                  <p className="text-lg leading-relaxed text-white/90">
                    For a long time, I kept track of all my flights in a spreadsheet. Every takeoff, landing, route, and detail was meticulously logged. It was a great way to track my progress and see how my skills developed over time. But I always felt like something was missing—a way to connect with other flight sim pilots and share our experiences.
                  </p>

                  <p className="text-lg leading-relaxed text-white/90">
                    That&apos;s why I built Logbook. I wanted to create a platform where flight simulator enthusiasts could:
                  </p>

                  <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed text-white/90 ml-4">
                    <li>Log their flights with detailed information</li>
                    <li>Track their progress and statistics over time</li>
                    <li>Share their flights with the community</li>
                    <li>Discover routes and experiences from other pilots</li>
                    <li>Connect with others who share the same passion</li>
                  </ul>

                  <p className="text-lg leading-relaxed text-white/90">
                    Logbook is more than just a digital logbook—it&apos;s a community hub for flight simulator enthusiasts. Whether you&apos;re flying commercial airliners, general aviation, or military aircraft, this platform is designed to help you document your virtual aviation journey and connect with others who understand the joy of flight simulation.
                  </p>

                  <p className="text-lg leading-relaxed text-white/90">
                    I hope you find Logbook as useful and enjoyable as I do. Happy flying!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Features Card */}
            <Card className="bg-[#0a0a0a] border-white/10">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">What You Can Do</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Detailed Logging</h3>
                    <p className="text-white/60">
                      Record every aspect of your flights: takeoff and landing details, routes, aircraft information, and more.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Track Statistics</h3>
                    <p className="text-white/60">
                      Monitor your total flights, hours, and miles flown. See your progress over time.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Share Your Flights</h3>
                    <p className="text-white/60">
                      Make your flights public and share your experiences with the community.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Discover Routes</h3>
                    <p className="text-white/60">
                      Browse flights from other pilots and get inspired for your next virtual journey.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="text-center pt-8">
              <Link
                href="/register"
                className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

