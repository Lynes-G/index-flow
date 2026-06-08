import Header from "@/components/shared/layout/Header";
import { LinkCreationSheetProvider } from "@/components/dashboard/links/LinkCreationSheetProvider";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "IndexFlow - Links in Bio Made Simple",
  description:
    "Create your personalized link in bio page with IndexFlow. Showcase your content, share your links, and connect with your audience effortlessly.",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <LinkCreationSheetProvider>
      <div className="dashboard-zone min-h-screen overflow-x-clip bg-transparent">
        <Header logoVariant="icon" />
        <main className="dashboard-zone mx-auto w-full max-w-[1760px] px-3 pt-6 pb-6 sm:px-4 sm:pt-8 lg:px-6 xl:px-6">
          {children}
        </main>
      </div>
    </LinkCreationSheetProvider>
  );
};

export default RootLayout;
