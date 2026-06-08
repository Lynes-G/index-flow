import { getDashboardShellAccess } from "@/lib/server/dashboardShellAccess";
import { redirect } from "next/navigation";

const DashboardUsernamePage = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const { isDevPreview } = await getDashboardShellAccess({
    pathname: "/dashboard/username",
    searchParams,
  });

  const target = isDevPreview ? "/dashboard?devPreview=1" : "/dashboard";
  redirect(target);
};

export default DashboardUsernamePage;
