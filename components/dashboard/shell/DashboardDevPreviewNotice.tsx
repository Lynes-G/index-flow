import { Eye } from "lucide-react";

type DashboardDevPreviewNoticeProps = {
  title?: string;
  description: string;
};

const DashboardDevPreviewNotice = ({
  title = "Local preview mode",
  description,
}: DashboardDevPreviewNoticeProps) => {
  return (
    <div className="rounded-lg border border-amber-200/80 bg-amber-50/90 p-3.5 text-sm leading-5 text-amber-950 shadow-sm shadow-amber-200/30 sm:rounded-lg sm:p-5 sm:leading-6">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-100 p-2 text-amber-700">
          <Eye className="size-4" />
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 text-amber-900/85">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardDevPreviewNotice;
