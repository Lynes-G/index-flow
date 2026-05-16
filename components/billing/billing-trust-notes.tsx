const trustNotes = [
  {
    title: "Secure checkout",
    body: "Plan changes stay in Clerk's hosted billing flow rather than a custom payment form.",
  },
  {
    title: "Clear access context",
    body: "Your effective plan and any admin-granted access stay visible before you compare options.",
  },
  {
    title: "Separate admin controls",
    body: "Invite-based grants live in their own area so standard billing decisions stay easier to follow.",
  },
];

export default function BillingTrustNotes() {
  return (
    <section
      aria-labelledby="billing-trust-notes-heading"
      className="space-y-4"
    >
      <div className="space-y-2">
        <h2
          id="billing-trust-notes-heading"
          className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900"
        >
          Billing assurances
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          A quick summary of what stays clear and protected while you review
          billing options.
        </p>
      </div>

      <ul className="grid gap-4 md:grid-cols-3">
        {trustNotes.map((note) => (
          <li key={note.title} className="template-card rounded-[1.5rem] p-5">
            <h3 className="font-semibold text-slate-900">{note.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{note.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
