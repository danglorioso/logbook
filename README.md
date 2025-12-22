# Logbook - Flight Simulator Logging Platform

A sleek, minimalistic social network platform for flight simulator enthusiasts to log, track, and share their virtual flights.

## Features

- **Passwordless Authentication**: Email-based magic link authentication using BetterAuth
- **Detailed Flight Logging**: Track every aspect of your flights across 4 phases:
  - General (aircraft, callsign, departure/arrival, route, fuel)
  - Takeoff (runway, SID, V-speeds, TOGA, flaps)
  - Landing (runway, STAR, brake settings, VAPP)
  - Post-Flight (duration, landing rate, time of day, passengers, cargo)
- **Profile Dashboard**: View your flight statistics including total flights, hours, and miles
- **Public Flight Sharing**: Share your flights with the community
- **Minimalistic Design**: Black background with white text for a sleek, professional look
- **Built with Modern Stack**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui
- **Authentication**: BetterAuth
- **Database**: Neon (PostgreSQL)
- **Form Handling**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 20+ 
- A Neon database account
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd logbook
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-random-secret-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:
   - Create a new database in Neon
   - Run the migration SQL from `src/lib/db/migrations.sql` in your Neon SQL editor

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
logbook/
├── src/
│   ├── app/              # Next.js app router pages
│   │   ├── api/          # API routes
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── profile/      # User profile page
│   │   └── public/       # Public flights page
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── AddFlightDialog.tsx
│   │   └── FlightCard.tsx
│   └── lib/              # Utilities and configurations
│       ├── auth.ts       # BetterAuth configuration
│       └── db/           # Database queries and schema
└── public/               # Static assets
```

## Database Schema

The application uses two main tables:

- **users**: Stores user account information
- **flights**: Stores detailed flight log entries

See `src/lib/db/migrations.sql` for the complete schema.

## Authentication

The app uses BetterAuth with passwordless email authentication (magic links). In development, magic links are logged to the console. In production, you'll need to configure an email service (e.g., Resend) in the `sendVerificationEmail` function in `src/lib/auth.ts`.

## Future Enhancements

- [ ] Map visualization with Mapbox showing flight routes
- [ ] Upload and map exact flight data points
- [ ] Advanced statistics dashboard (CO2 emissions, times around Earth, etc.)
- [ ] Pie charts for flight categories
- [ ] User following and social features
- [ ] Flight comments and interactions
- [ ] Export flight logs to PDF/CSV

## License

MIT
