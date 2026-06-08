import { ConvexClient, ConvexHttpClient } from "convex/browser";

const getConvexUrl = () => {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not defined");
  }

  return convexUrl;
};

export const getHttpClient = () => {
  return new ConvexHttpClient(getConvexUrl());
};

export const getClient = () => {
  return new ConvexClient(getConvexUrl());
};
