This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

## Admin & Media Management

- Admin is protected via middleware. Default credentials can be set with `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- Upload supports drag/drop/paste. Duplicates are detected by normalized filename; pass `allowDuplicate=1` to override.
- Reorder, delete (per section), and randomize operations persist to the image manifest.

### Vercel Blob (production persistence)

When deployed on Vercel, the filesystem is immutable. To enable uploads and manifest changes in production, configure Vercel Blob:

- Install the Vercel Blob integration for the project.
- Set these environment variables in Vercel:
  - `BLOB_MANIFEST_KEY` e.g. `images.manifest.json` (stable key used to store the manifest)
  - `BLOB_MANIFEST_URL` public URL to the manifest Blob (e.g. `https://<bucket>.public.blob.vercel-storage.com/images.manifest.json`)
  - `BLOB_READ_WRITE_TOKEN` only needed for local development; in Vercel it is injected automatically by the integration

With these configured, the app will:

- Read and write the manifest to Blob.
- Upload new image assets to Blob under `optimized/<section>/<id>.{webp,avif}`.
- Continue to support local development by writing to `public/optimized/*`.
