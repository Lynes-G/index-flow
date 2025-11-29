import Header from "@/components/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IndexFlow - Links in Bio Made Simple",
  description:
    "Create your personalized link in bio page with IndexFlow. Showcase your content, share your links, and connect with your audience effortlessly.",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Header />
      <main className="max-w-7xl px-4 pt-10 lg:mx-auto xl:px-0">
        {children}
      </main>
    </div>
  );
};

export default RootLayout;
