import CustomizationForm from "@/components/CustomizationForm";
import { DashboardContextRail } from "@/components/dashboard/DashboardContextRail";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";
import { Eye, Palette } from "lucide-react";
import { redirect } from "next/navigation";

const DashboardAppearancePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <DashboardShell
      sidebar={<DashboardSidebar currentTask="appearance" />}
      rail={
        <DashboardContextRail className="space-y-5">
          <div className="space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-slate-500 uppercase">
              Preview companion
            </p>
            <div className="space-y-2">
              <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900">
                Style first, compare constantly
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                The editor now owns the live desktop preview in appearance mode,
                so your unsaved changes stay visually close to the controls.
              </p>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-slate-200/80 bg-white/88 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-900 p-2.5 text-white">
                <Eye className="size-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-slate-900">
                  Desktop + mobile checks
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  Use the sticky desktop phone on wide screens, then open the
                  mobile preview sheet on smaller screens to compare both
                  experiences before saving.
                </p>
              </div>
            </div>
          </div>
        </DashboardContextRail>
      }
      title="Style the look of your public page"
      description="Use this appearance workspace to tune layout, colors, imagery, and bio details while the live preview stays close to the controls."
      actions={
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600">
          <Palette className="size-4" />
          Appearance workspace
        </span>
      }
    >
      <CustomizationForm shellMode="appearance" />
    </DashboardShell>
  );
};

export default DashboardAppearancePage;
