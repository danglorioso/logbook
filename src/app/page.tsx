import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plane, MapPin, BarChart3, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-6 w-6" />
            <span className="text-xl font-semibold">Logbook</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Track Your
            <br />
            <span className="text-white/80">Flight Simulator</span>
            <br />
            Adventures
          </h1>
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed">
            Log every flight, track your progress, and share your journeys with 
            the flight simulator community. Built for pilots who take simulation seriously.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Logging Flights
              </Button>
            </Link>
            <Link href="/public">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Public Flights
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Everything You Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Plane className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Detailed Logging</h3>
              <p className="text-white/60">
                Track every aspect of your flights: takeoff, landing, route, and more.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Route Mapping</h3>
              <p className="text-white/60">
                Visualize your flight paths and see where you've been.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Flight Statistics</h3>
              <p className="text-white/60">
                Track your total flights, hours, miles, and achievements.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">Community</h3>
              <p className="text-white/60">
                Share your flights and discover routes from other pilots.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-white/60 mb-8">
            Join the community of flight simulator enthusiasts tracking their journeys.
          </p>
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6">
              Create Your Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/40 text-sm">
          <p>© 2024 Logbook. Built for flight simulator enthusiasts.</p>
        </div>
      </footer>
    </div>
  );
}
