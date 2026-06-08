import { dashboardSurfaceClasses } from "@/components/dashboard/styles";

const trustNotes = [
  {
    title: "Free by default",
    body: "New sign-ups keep Free access unless an admin invite grants Pro or Ultra.",
  },
  {
    title: "Clear access context",
    body: "Your effective plan and any admin-granted access stay visible in one place.",
  },
  {
    title: "Admin-controlled upgrades",
    body: "Invite-based grants are the only upgrade path while billing is temporarily disabled.",
  },
];

export default function BillingTrustNotes() {
  return (
    <section
      aria-labelledby="billing-trust-notes-heading"
      className="space-y-3.5 sm:space-y-4"
    >
      <div className="space-y-2">
        <h2
          id="billing-trust-notes-heading"
          className="font-['Sora',sans-serif] text-[1.45rem] font-semibold tracking-[-0.05em] text-slate-900 sm:text-2xl"
        >
          Access notes
        </h2>
        <p className="max-w-2xl text-[13px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
          A quick summary of how access works while paid billing is paused.
        </p>
      </div>

      <ul className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {trustNotes.map((note) => (
          <li
            key={note.title}
            className={`${dashboardSurfaceClasses.card} p-4 sm:p-5`}
          >
            <h3 className="font-semibold text-slate-900">{note.title}</h3>
            <p className="mt-2 text-[13px] leading-5 text-slate-600 sm:text-sm sm:leading-6">
              {note.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
