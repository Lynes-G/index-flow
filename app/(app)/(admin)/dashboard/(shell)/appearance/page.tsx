import CustomizationForm, {
  CustomizationDesktopPreviewRail,
  CustomizationPreviewProvider,
} from "@/components/CustomizationForm";
import { DashboardContextRail } from "@/components/dashboard/DashboardContextRail";
import DashboardShell from "@/components/dashboard/DashboardShell";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { auth } from "@clerk/nextjs/server";
import { Palette } from "lucide-react";
import { redirect } from "next/navigation";

const DashboardAppearancePage = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <CustomizationPreviewProvider>
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
                  Keep the controls in the center and the public result on the
                  right so each visual choice is easy to judge before you save.
                </p>
              </div>
            </div>
            <CustomizationDesktopPreviewRail />
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
    </CustomizationPreviewProvider>
  );
};

export default DashboardAppearancePage;
