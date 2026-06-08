import type { ReactNode } from "react";

import type { CustomizationTab } from "@/components/dashboard/customization/shared";

type CustomizationTabPanelProps = {
  activeTab: CustomizationTab;
  tab: CustomizationTab;
  children: ReactNode;
};

const CustomizationTabPanel = ({
  activeTab,
  tab,
  children,
}: CustomizationTabPanelProps) => (
  <div
    role="tabpanel"
    id={`panel-${tab}`}
    aria-labelledby={`tab-${tab}`}
    hidden={activeTab !== tab}
  >
    {activeTab === tab ? children : null}
  </div>
);

export default CustomizationTabPanel;
