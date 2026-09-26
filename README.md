# AI Political Poster Maker

An MVP for creating Bangla political and community posters. Gemini generates structured copy and layout guidance; the browser renders exact text and uploaded photos into a print-resolution poster. MongoDB stores per-user poster history, and Cloudinary stores uploaded photos.

## MVP Setup

Requirements: Node.js 20+, MongoDB, a Gemini API key, and a Cloudinary account.

Copy `.env.example` to `.env`, then set MongoDB, JWT, NextAuth, Gemini, and Cloudinary values. Use different random secrets for `JWT_SECRET` and `NEXTAUTH_SECRET`. Keep `.env` private.

Run the backend and seed templates:

```bash
npm install
npm run seed:templates
npm run server:dev
```

In another terminal, start Next.js:

```bash
npm run dev
```

Open `http://localhost:3000`. The Express server must be running for registration, image uploads, templates, and poster history.

`NEXT_PUBLIC_API_URL` defaults to `http://localhost:5000`; `CLIENT_URL` defaults to `http://localhost:3000`.

## API Surface

- Auth: `POST /api/auth/register`, `POST /api/auth/login`
- Templates: `GET /api/templates`, `GET /api/templates/:id`
- Uploads: authenticated `POST /api/upload`, up to three PNG/JPG/WEBP files, 5 MB each
- Posters: authenticated create/list/get/update/delete endpoints under `/api/posters`
- Regeneration: `POST /api/posters/:id/regenerate`, three retries per saved poster
- AI: authenticated `POST /api/ai/generate`, limited to 10 requests per user per 10 minutes per server process

The starter template set is read-only and seeded with `npm run seed:templates`. Saved poster inputs can be reopened and exported again from history. PNG/JPG and PDF exports are rendered in the browser at 1200×1600.

For deployment, host Next.js and Express separately, set the environment variables on each service, allow the frontend origin in `CLIENT_URL`, and use MongoDB Atlas plus Cloudinary. The Gemini request limit is process-local; multi-instance deployments should use a shared rate-limit store.

## Next.js Starter References

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
