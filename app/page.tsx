import Header from "@/components/Header";
import { ClosingPanel } from "@/components/marketing/closing-panel";
import { EditorialHero } from "@/components/marketing/editorial-hero";
import { FeatureStoryGrid } from "@/components/marketing/feature-story-grid";
import { ProcessStrip } from "@/components/marketing/process-strip";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <div className="template-shell min-h-screen text-slate-900">
      <Header isFixed={true} logoHref="/" />

      <main className="overflow-hidden pt-20 sm:pt-24">
        <EditorialHero />
        <FeatureStoryGrid />
        <ProcessStrip />
        <ClosingPanel />
      </main>
    </div>
  );
}
