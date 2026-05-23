import { AtSign } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import UsernameForm from "@/components/UsernameForm";
import { DashboardContextRail } from "@/components/dashboard/DashboardContextRail";
import DashboardRailProfileCard from "@/components/dashboard/DashboardRailProfileCard";
import DashboardRailUsernameCard from "@/components/dashboard/DashboardRailUsernameCard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardUsernamePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="username" />}
      rail={
        <DashboardContextRail className="space-y-5">
          <DashboardRailProfileCard />
          <DashboardRailUsernameCard />
        </DashboardContextRail>
      }
      title="Choose the public username people will remember"
      description="This workspace is focused on one utility task: setting the URL people type, tap, and share when they visit your profile."
      actions={
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
          <AtSign className="size-4" />
          Username workspace
        </span>
      }
    >
      <UsernameForm />
    </DashboardShell>
  );
};

export default DashboardUsernamePage;
