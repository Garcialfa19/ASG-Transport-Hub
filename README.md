# ASG Transport Hub

ASG Transport Hub is a Firebase-backed Next.js application that helps the ASG team manage and publish public transport information. The project combines a passenger-facing site with an authenticated admin dashboard where the content team can curate routes, drivers, and operational alerts.

## Features

- **Passenger experience** – Displays the list of bus routes with fares, categories, and detailed schedules.
- **Operational alerts** – Surfaces urgent service notices that are maintained in Firestore.
- **Admin authentication** – Uses Firebase Authentication to secure the dashboard.
- **Content management** – CRUD workflows for routes, drivers, and alerts, including support for schedule/card image uploads to Cloud Storage.
- **Realtime-ready data layer** – Client components subscribe to Firestore collections so updates appear without a page refresh.

## Tech Stack

- [Next.js 14](https://nextjs.org/) with the App Router and TypeScript.
- [Firebase Authentication](https://firebase.google.com/docs/auth) for admin login.
- [Cloud Firestore](https://firebase.google.com/docs/firestore) for structured content.
- [Cloud Storage for Firebase](https://firebase.google.com/docs/storage) for media uploads.
- [Tailwind CSS](https://tailwindcss.com/) with shadcn/ui primitives for styling.
- [Zod](https://zod.dev/) and [react-hook-form](https://react-hook-form.com/) for declarative form validation.

## Project Layout

```
src/
├─ app/                    # Next.js routes, layouts, and providers
│  ├─ admin/               # Authenticated admin entry point
│  ├─ (public)/            # Public-facing passenger pages
│  ├─ globals.css          # Tailwind base styles
│  └─ providers.tsx        # Top-level context/providers
├─ components/             # Reusable UI and feature components
│  └─ admin/               # Dashboard widgets and forms
├─ hooks/                  # Client-side hooks (auth, UI helpers)
├─ lib/                    # Firebase helpers, server actions, utilities
│  └─ firebase/            # Firebase Admin and client SDK wrappers
└─ ai/                     # Prompt assets used by Firebase Studio
```

Refer to [`docs/blueprint.md`](docs/blueprint.md) for the original product brief and visual guidelines.

## Getting Started

### Prerequisites

- Node.js 18+ (Next.js 14 leans on the fetch API that ships with Node 18).
- An existing Firebase project with Authentication, Firestore, and Storage enabled.
- A service account with `Editor` + `Storage Admin` permissions for server actions.

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase credentials

Create a `.env.local` file at the project root with the Admin SDK service account and any runtime secrets. The minimum configuration includes:

```
# Firebase client-side config is currently hard-coded in src/lib/firebase/config.ts
# For production, move those values into the environment and import them here.
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_STORAGE_URL=...
```

I keep a copy of `.env.local.example` in my personal notes (not committed) so I can bootstrap new machines quickly.

> **Note:** The Firebase client configuration that ships with this repository is intended for development only. Before deploying, switch to environment variables to avoid committing sensitive keys.

### 3. Seed baseline data (optional but recommended)

Firestore security rules block empty states on the public site. I usually seed the core collections manually through the admin dashboard:

1. Log in at `/admin` with a Firebase user that has access to the project.
2. Create at least one route, driver, and alert.
3. Upload placeholder images so I can sanity check the public gallery.

Once the shape looks right, I back up the documents via the Firebase console so I can restore them if needed.

### 4. Run the development server

```bash
npm run dev
```

The app starts on [http://localhost:3000](http://localhost:3000). The admin dashboard is available at `/admin` and requires a Firebase user that belongs to your project.

### 5. Build for production

```bash
npm run build && npm run start
```

## Firebase Resources

| Collection | Purpose | Key fields |
|------------|---------|------------|
| `routes`   | Passenger routes and schedules displayed on the home page. | `nombre`, `category`, `tarifaCRC`, `imagenTarjetaUrl`, `imagenHorarioUrl`, `lastUpdated` |
| `drivers`  | Driver directory used by operations. | `nombre`, `routeId`, `status`, `comment`, `lastUpdated` |
| `alerts`   | Time-sensitive notifications surfaced on the passenger home page. | `titulo`, `lastUpdated` |

Media uploads are stored in Cloud Storage under the `route-images/` prefix. Uploaded files are given a generated name and returned as public URLs.

### Indexes I rely on

These composite indexes live under **Firestore Database → Indexes**. I document them here so I do not forget to recreate them in new projects:

| Collection | Fields | Purpose |
|------------|--------|---------|
| `routes`   | `nombre` (Ascending) | Keep the dashboard list alphabetical. |
| `alerts`   | `lastUpdated` (Descending) | Surface the freshest service notices first. |
| `drivers`  | `nombre` (Ascending) | Match the roster view in the admin. |

## Admin Dashboard Workflow

1. Log in with an authorized Firebase user at `/admin`.
2. Use the tabs to switch between Routes, Drivers, and Alerts.
3. Add or edit entries with the modal forms. Each action calls a server action in `src/lib/actions.ts` that writes to Firestore and revalidates the relevant pages.
4. Uploaded images are streamed to Cloud Storage in the background, and the resulting public URL is written back into the form state.

## Troubleshooting

- **Auth loop on `/admin`:** Confirm that `FirebaseProvider` mounts in `src/app/providers.tsx` and that the client SDK is initialized with the same project ID as the Admin SDK.
- **Uploads fail with permission errors:** Check that the service account used in `.env.local` has `Storage Admin` permissions and that CORS is configured to allow uploads.
- **Content missing on public pages:** Make sure you have at least one document in each Firestore collection, and that `lastUpdated` is a string so the serializers match the TypeScript definitions.
- **`Missing or insufficient permissions` from server actions:** My service account occasionally loses rights when I rotate keys. Re-download the JSON and verify IAM bindings if mutations suddenly stop working.
- **Images not rendering on Vercel:** Add the Storage bucket domain to `next.config.ts` (`images.remotePatterns`) so Next.js does not block the CDN URL.

## Contributing

1. Fork the repository and create a feature branch.
2. Make your changes and add unit/integration tests if applicable.
3. Submit a pull request. Use the included linting and formatting configuration to keep the codebase consistent.

### Quality Gates I watch

- `npm run lint` — catches TypeScript and accessibility issues.
- `npm run typecheck` — validates the Zod schemas align with the Firestore types.

### Deployment checklist (personal cheat sheet)

1. Move the Firebase client config from `src/lib/firebase/config.ts` into environment variables.
2. Provision a dedicated Firebase service account for the hosting provider and load the JSON into secrets.
3. Run `npm run build` locally and skim the output for warnings.
4. Double-check Firestore/Storage security rules to ensure only admins can mutate content.
5. Tag the release in git once the deployment is green so I can trace back fixes quickly.

---

This documentation reflects how I maintain and operate the ASG Transport Hub. Update it whenever the data model or deployment workflow changes so the rest of the team can follow along.


Test