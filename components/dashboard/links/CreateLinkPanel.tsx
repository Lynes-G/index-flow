import CreateLinkForm from "@/components/dashboard/links/CreateLinkForm";
import { dashboardSurfaceClasses } from "@/components/dashboard/styles";

const featureNotes = [
  {
    text: "Easy drag & drop reordering",
    color: "bg-brand-red",
  },
  {
    text: "Automatic URL validation",
    color: "bg-brand-purple",
  },
  {
    text: "Click tracking analytics",
    color: "bg-brand-lime",
  },
];

const brandDotClassNames = ["bg-brand-red", "bg-brand-purple", "bg-brand-lime"];

const createFeatureDotClass = (colorClass: string) =>
  `size-2 rounded-full ${colorClass}`;

type CreateLinkPanelProps = {
  submitLabel?: string;
  onSuccess?: () => void | Promise<void>;
};

const CreateLinkPanel = ({ submitLabel, onSuccess }: CreateLinkPanelProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {/* The intro gives the user the "what happens next" context before
            they hit the form, which reduces hesitation in the create flow. */}
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Create a new link
          </h1>
          <div className="mt-4 flex gap-1.5" aria-hidden="true">
            {brandDotClassNames.map((className) => (
              <span
                key={className}
                className={`size-2.5 rounded-full ${className}`}
              />
            ))}
          </div>
        </div>
        <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Add a destination to your link-in-bio page. New links appear in the
          order you create them, and you can reorganize everything later from
          the dashboard.
        </p>
        <div className="space-y-4 pt-2">
          {featureNotes.map((note) => (
            <div key={note.text} className="flex items-center gap-3">
              <div className={createFeatureDotClass(note.color)} />
              <span className="text-base text-slate-600">{note.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${dashboardSurfaceClasses.card} ${dashboardSurfaceClasses.cardPaddingLarge}`}
      >
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">Link details</h2>
          <p className="text-sm leading-6 text-slate-500 sm:text-base">
            Give your link a clear name and paste a full URL or a domain like
            example.com.
          </p>
        </div>

        <CreateLinkForm submitLabel={submitLabel} onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default CreateLinkPanel;
