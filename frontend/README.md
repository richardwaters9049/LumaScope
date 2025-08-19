# LumaScope Frontend

This is the frontend for LumaScope, a web application for AI-powered blood smear analysis for early leukemia detection.

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Backend API server (see backend README for setup)

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory with the following variables:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000  # URL of your backend API

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id  # Optional: for Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=your-google-client-secret  # Optional: for Google OAuth

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false  # Set to true to enable analytics
```

4. Run the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication

The application uses JWT for authentication. When a user logs in, they receive an access token and a refresh token. The access token is short-lived (30 minutes by default) and the refresh token is longer-lived (7 days).

### Token Refresh Flow

1. When making an API request, if the access token is expired:
   - The API will return a 401 Unauthorized response
   - The frontend will automatically attempt to refresh the token using the refresh token
   - If successful, the request will be retried with the new access token
   - If unsuccessful, the user will be logged out and redirected to the login page

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | URL of the backend API | Yes | `http://localhost:8000` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID | No | - |
| `NEXT_PUBLIC_GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No | - |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | No | `false` |

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - Reusable UI components
- `/contexts` - React contexts (e.g., authentication)
- `/lib` - Utility functions and API client
- `/styles` - Global styles and theme configuration
- `/types` - TypeScript type definitions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
