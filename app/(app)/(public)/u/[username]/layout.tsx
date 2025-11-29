import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Link in Bio - Public Profile",
  description: "View the public Link in Bio profile of the user.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div>{children}</div>;
}
