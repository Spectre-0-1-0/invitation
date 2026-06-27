# College Memory Archive | Class of 2025

A digital sanctuary preserving the laughter, late nights, and lifelong bonds of the graduating class of 2025. Built with Next.js 15, Prisma, and Tailwind CSS.

## 🚀 Getting Started

Follow these steps to get the project running locally.

### 1. Prerequisites
- Node.js 18+
- npm or pnpm
- A PostgreSQL database (Supabase recommended)

### 2. Clone the Repository
```bash
git clone <repository-url>
cd college-memory-archive
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Create a `.env` file in the root directory and add the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/db?schema=public"
DIRECT_URL="postgresql://user:password@localhost:5432/db?schema=public"

# Admin Access
ADMIN_SECRET="your-secure-passcode"

# Supabase (Required for media storage in production)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 5. Initialize Database
Push the Prisma schema to your database and generate the client:

```bash
npx prisma db push
npx prisma generate
```

### 6. Run the Application
Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🛠 Project Structure

- `src/app`: Application routes (Public & Admin)
- `src/components`: UI & Layout components
- `src/lib`: Core logic & Data fetchers
- `prisma`: Database schema
- `docs`: Detailed documentation & Handoff materials

## 🔐 Admin Access
To access the management console, navigate to `/admin` and log in using the `ADMIN_SECRET` configured in your environment variables.

## 📖 Documentation
For more detailed information, please refer to the following documents:
- [Project Handoff](docs/PROJECT_HANDOFF.md)
- [Runtime Verification Report](docs/RUNTIME_VERIFICATION_REPORT.md)
- [Storage Migration Checklist](docs/STORAGE_MIGRATION_CHECKLIST.md)
- [Technical Debt Audit](docs/TECHNICAL_DEBT.md)

## 📄 License
This project is proprietary and built for the graduating class of 2025.
