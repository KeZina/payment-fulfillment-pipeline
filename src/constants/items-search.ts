import { debounce } from "nuqs/server";

export const ITEMS_SEARCH_MAX_LENGTH = 100;
export const SEARCH_DEBOUNCE_MS = 300;
export const SEARCH_URL_DEBOUNCE = debounce(SEARCH_DEBOUNCE_MS);
