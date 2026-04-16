# ftmag

Food & Travel Magazine — Next.js front end (glass UI, video backdrop).

## Local setup

1. Put `background.mp4` and `logo.png` in the `public/` folder (see `public/PLACE_ASSETS_HERE.txt`).
2. Copy `.env.example` to `.env.local`. Set **`DATABASE_URL`** (PostgreSQL) and **`SESSION_SECRET`** (at least 32 characters).
3. `npm install`
4. `npx prisma db push` then `npm run db:seed` (creates the admin user from `prisma/seed.ts`).
5. `npm run dev` — open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin](http://localhost:3000/admin).

## Deploy (Vercel)

Connect this repo to Vercel; framework preset **Next.js**. Add **`DATABASE_URL`**, **`SESSION_SECRET`** (32+ chars), and run migrations/seed against production (or `prisma db push` + `db:seed` from a machine with prod `DATABASE_URL`).

## Stack

- Next.js 14 (App Router)
- Prisma + PostgreSQL (admin users, email list, paid subscribers)
- iron-session + bcrypt (admin auth)
- Tailwind CSS
- Fonts: Electrolize (nav), Cormorant Garamond (welcome headline)
