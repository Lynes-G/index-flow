import NotFoundPageView from "@/components/shared/layout/NotFoundPageView";

const MissingPublicProfilePage = () => {
  return (
    <NotFoundPageView
      badge="Profile missing"
      title="That profile is off the grid."
      description="We looked through IndexFlow, but this public page does not belong to an active profile. The username may be wrong, changed, or no longer public."
      primaryAction={{
        href: "/",
        label: "Explore IndexFlow",
      }}
      secondaryAction={{
        href: "/sign-up",
        label: "Create your page",
      }}
      helperTitle="Why this happens"
      helperDescription="A public profile works like a saved contact card. If the username changes or the card never existed, the route still opens but there is no real profile behind it."
      helperItems={[
        "Double-check the username you typed after `/u/`.",
        "Ask the creator whether they changed their public username.",
        "Start your own page if you were testing a new route idea.",
      ]}
    />
  );
};

export default MissingPublicProfilePage;
