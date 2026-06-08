"use client";

import { useEffect } from "react";

import { trackProfileView } from "@/lib/frontend/analytics/analytics";

type ProfileViewTrackerProps = {
  username: string;
};

const ProfileViewTracker = ({ username }: ProfileViewTrackerProps) => {
  useEffect(() => {
    void trackProfileView(username);
  }, [username]);

  return null;
};

export default ProfileViewTracker;
