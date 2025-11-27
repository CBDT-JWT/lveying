# Build Time Display

This project automatically displays the build time in the footer of all guest pages.

## How it works

1. When running `npm run build`, a Node.js script (`scripts/set-build-time.js`) is executed first
2. The script generates a timestamp in format `YYYY.MM.DD HH:MM` and writes it to `.env.local`
3. Next.js picks up the `NEXT_PUBLIC_BUILD_TIME` environment variable during build
4. All guest pages display this timestamp in their footer as "Last Build: YYYY.MM.DD HH:MM"

## Development Mode

In development mode (`npm run dev`), the build time will show the current time dynamically since no build has occurred.

## Production Build

To set the build time for production:

```bash
npm run build
```

The build time will be frozen at the time of the build and displayed consistently across all pages.
