export const DASHBOARD_PATH = "/dashboard";
export const DASHBOARD_NEW_LINK_PATH = "/dashboard/new-link";
export const CREATE_LINK_SHEET_QUERY_KEY = "createLink";
const CREATE_LINK_SHEET_QUERY_VALUE = "1";

export const getCreateLinkSheetHref = () =>
  `${DASHBOARD_PATH}?${CREATE_LINK_SHEET_QUERY_KEY}=${CREATE_LINK_SHEET_QUERY_VALUE}`;

export const shouldOpenCreateLinkSheet = (searchParams: {
  get: (key: string) => string | null;
}) =>
  searchParams.get(CREATE_LINK_SHEET_QUERY_KEY) ===
  CREATE_LINK_SHEET_QUERY_VALUE;
