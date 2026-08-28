export const AVATAR_MAX_OUTPUT_BYTES = 1024 * 1024;

export const AVATAR_MAX_SOURCE_BYTES = 15 * 1024 * 1024;

export const AVATAR_ACCEPTED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const AVATAR_ACCEPT_ATTRIBUTE = AVATAR_ACCEPTED_MIME_TYPES.join(",");

export const AVATAR_MAX_DATA_URL_LENGTH = 1_400_000;

export const AVATAR_OUTPUT_DIMENSIONS = [512, 384, 256] as const;

export const AVATAR_OUTPUT_QUALITIES = [0.85, 0.75, 0.65, 0.55, 0.45] as const;

export const AVATAR_NAV_DISPLAY_SIZE_PX = 32;

export const AVATAR_SETTINGS_PREVIEW_SIZE_PX = 80;
