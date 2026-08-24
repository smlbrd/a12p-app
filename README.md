# a12p-app

A web application built with [Hono](https://hono.dev/), [HonoX](https://github.com/honox/honox),
and [React](https://react.dev/).

## 🚀 Overview

`a12p-app` is a full-stack application featuring a backend powered by Hono and a modern frontend
utilising HonoX's island architecture. It leverages [Drizzle ORM](https://orm.drizzle.team/) for type-safe database
interactions with PostgreSQL and [Tailwind CSS](https://tailwindcss.com/) for styling.

## ✨ Key Features

- **Backend**: High-performance API and server-side rendering using Hono and HonoX.
- **Database**: Type-safe schema management with Drizzle ORM and PostgreSQL.
- **Frontend**: Interactive UI components using React (Islands architecture) and Tailwind CSS.
- **Testing**: Comprehensive test suite including Unit, Integration, and E2E tests (Vitest & Playwright).
- **Infrastructure**: Containerised environment with Docker and Infrastructure as Code (IaC) via Terraform.
- **Security**: Secure password hashing using Argon2.
- **Validation**: Schema-based request validation using Zod.

## 🛠️ Tech Stack

- **Runtime/Framework**: Hono, HonoX, Node.js
- **Frontend**: React, Tailwind CSS
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Testing**: Vitest, Playwright
- **Build Tool**: Vite, Esbuild
- **Linting/Formatting**: ESLint, Prettier, Husky, lint-staged
- **Deployment/Infrastructure**: Docker, Terraform

## 🚦 Getting Started

### Prerequisites

- Node.js (latest LTS recommended)
- npm or yarn
- Docker and Docker Compose (for local database/services)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/smlbrd/a12p-app.git
   cd a12p-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

To start the development server:

```bash
npm run dev
```

### Database Setup

To set up and seed your local database:

```bash
# Push schema changes and seed local database
npm run db:setup:local
```

### Testing

Run the full suite of tests:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# End-to-end tests
npm run test:e2e

# Coverage report
npm run coverage
```

### Deployment

To run the application using Docker Compose:

```bash
# Start services
npm run up

# Stop services
npm run down
```

## 📁 Project Structure

- `app/`: Main application logic.
    - `routes/`: Hono routes for API and UI.
    - `components/`: Shared React components.
    - `islands/`: Interactive React components (Islands).
    - `db/`: Database schema, migrations, and seeding.
    - `services/`: Business logic and services.
    - `middleware/`: Application middleware (auth, error handling, etc.).
- `drizzle/`: SQL migration files.
- `terraform/`: Terraform configuration for infrastructure.
- `scripts/`: Utility scripts for database management and seeding.
- `test-results/`: Test execution artifacts.
- `dist/`: Production build artifacts.