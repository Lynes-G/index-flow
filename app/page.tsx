import Header from "@/components/shared/layout/Header";
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
    <div className="template-shell no-bg-patterns min-h-screen text-slate-900">
      <Header isFixed={true} logoHref="/" pillExpandsOnScroll={true} />

      <main className="overflow-hidden">
        <EditorialHero />
        <FeatureStoryGrid />
        <ProcessStrip />
        <ClosingPanel />
      </main>
    </div>
  );
}
