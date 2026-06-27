# SendFlow Mobile

Mobile email marketing companion for the SendFlow platform. Built with Expo (SDK 55), React Native (New Architecture), NativeWind (Tailwind CSS), and Zustand.

## Features

- **Dashboard** — KPI stats, tags breakdown, recent campaigns, quick actions
- **Contacts** — Full CRUD with search, tags, address fields, subscription management
- **Campaigns** — Create with template/contact/tag targeting, schedule, send, duplicate, preview
- **Message Templates** — CRUD with HTML body editor
- **Tags** — Create, manage, bulk delete
- **Inbox** — Inbound messages with inbox/done/trash tabs
- **Sources & Labels** — Manage email sources and message labels
- **Automations** — View, pause/activate, delete automation workflows
- **Profile** — Edit name/email, change password
- **Guest Login** — One-tap demo account access

## Prerequisites

- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [SendFlow Laravel Backend](https://github.com/your-org/sendflow-backend) running on port 8000

## Getting Started

```bash
git clone <repo-url>
cd sendflow-mobile
npm install
```

### Configure API URL

Edit `.env` with your backend address:

```env
EXPO_PUBLIC_API_URL=http://YOUR_IP:8000/api
```

Use your computer's LAN IP (e.g., `192.168.1.100`) so your phone can reach the backend.

### Start

```bash
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS).

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Expo SDK 55, React Native 0.83 |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind v4 (Tailwind CSS) |
| State | Zustand v5 |
| HTTP | Axios |
| Language | TypeScript (strict) |

## Project Structure

```
app/                          # Expo Router screens
├── _layout.tsx               # Root stack navigator
├── index.tsx                 # Auth redirect
├── login.tsx                 # Login + guest login
├── register.tsx              # Registration
├── (tabs)/                   # Bottom tab navigator
│   ├── _layout.tsx
│   ├── index.tsx             # Dashboard
│   ├── contacts.tsx
│   ├── campaigns.tsx
│   └── settings.tsx
├── contact/                  # Contact create/detail
├── campaign/                 # Campaign create/detail/preview
├── templates/                # Template list/create/edit
├── tags/                     # Tag management
├── inbox/                    # Inbound messages
├── sources/                  # Email sources
├── labels/                   # Message labels
├── automations/              # Automation workflows
└── profile/                  # Profile settings

src/                          # Shared code
├── api/                      # API client + service modules
├── components/               # Reusable UI components
├── stores/                   # Zustand stores
└── types/                    # TypeScript interfaces
```

## API Endpoints Consumed

The app communicates with the SendFlow Laravel API (`/api` prefix):

| Endpoint | Purpose |
|---|---|
| `POST /auth/login` | Login |
| `POST /auth/register` | Register |
| `GET /auth/user` | Current user |
| `POST /auth/logout` | Logout |
| `GET /dashboard` | Dashboard stats |
| `CRUD /contacts` | Contact management |
| `CRUD /campaigns` | Campaign management |
| `POST /campaigns/{id}/send` | Send campaign |
| `GET /tags` | Tags list |
| `CRUD /message-temp` | Message templates |
| `GET /audience/inbox` | Inbox messages |
| `CRUD /add-source` | Email sources |
| `CRUD /audience/add-labels` | Labels |
| `CRUD /automations` | Automations |
| `GET/PUT /profile` | Profile management |
| `GET /notifications` | Notifications |

## Guest Demo

Tap **"Try Demo Account"** on the login screen to auto-login as `demo@sendflow.test`.
