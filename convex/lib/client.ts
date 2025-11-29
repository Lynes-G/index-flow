import { ConvexClient, ConvexHttpClient } from "convex/browser";

// HTTP client
export const getHttpClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL)
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
};

// Subscription client
export const getClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL)
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
  return new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL);
};
