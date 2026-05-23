import Header from "@/components/Header";
import { LinkCreationSheetProvider } from "@/components/LinkCreationSheetProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IndexFlow - Links in Bio Made Simple",
  description:
    "Create your personalized link in bio page with IndexFlow. Showcase your content, share your links, and connect with your audience effortlessly.",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <LinkCreationSheetProvider>
      <div>
        <Header />
        <main className="w-full px-4 pt-10 xl:px-6 2xl:px-8">
          {children}
        </main>
      </div>
    </LinkCreationSheetProvider>
  );
};

export default RootLayout;
