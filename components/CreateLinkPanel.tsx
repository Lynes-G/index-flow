import CreateLinkForm from "@/components/CreateLinkForm";

const featureNotes = [
  {
    text: "Easy drag & drop reordering",
  },
  {
    text: "Automatic URL validation",
  },
  {
    text: "Click tracking analytics",
  },
];

type CreateLinkPanelProps = {
  submitLabel?: string;
  onSuccess?: () => void | Promise<void>;
};

const CreateLinkPanel = ({ submitLabel, onSuccess }: CreateLinkPanelProps) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Create a new link
          </h1>
          <div className="mt-4 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-orange-500" />
        </div>
        <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
          Add a destination to your link-in-bio page. New links appear in the
          order you create them, and you can reorganize everything later from
          the dashboard.
        </p>
        <div className="space-y-4 pt-2">
          {featureNotes.map((note) => (
            <div key={note.text} className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-[color:var(--brand-accent)]" />
              <span className="text-base text-slate-600">{note.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-5 shadow-sm sm:p-6 lg:p-8">
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
