import NotFoundPageView from "@/components/shared/layout/NotFoundPageView";

const NotFoundPage = () => {
  return (
    <NotFoundPageView
      badge="Page not found"
      title="This page wandered off the map."
      description="The link you opened does not lead anywhere useful right now. It may have moved, expired, or never existed in the first place."
      primaryAction={{
        href: "/",
        label: "Back to home",
      }}
      secondaryAction={{
        href: "/dashboard",
        label: "Open dashboard",
      }}
      helperTitle="Try one of these quick saves"
      helperDescription="Think of this like arriving at the wrong apartment number. The building is real, but this door is not the one you wanted."
      helperItems={[
        "Check the URL for a typo, especially usernames, slashes, or copied extra characters.",
        "Jump back to the homepage to restart your path through IndexFlow.",
        "If you expected private content, sign in and reopen it from your dashboard.",
      ]}
    />
  );
};

export default NotFoundPage;
