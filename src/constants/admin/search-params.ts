// The admin items page reads searchParams in a server component (no
// client-side fetching), so updates must be non-shallow to trigger a
// Next.js navigation and re-render the server component tree with the new
// query values.
export const ADMIN_ITEMS_SEARCH_PARAM_OPTIONS = { shallow: false } as const;
