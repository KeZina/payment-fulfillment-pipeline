export function getUserInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  const firstInitial = parts[0].slice(0, 1);
  const lastInitial = parts[parts.length - 1].slice(0, 1); // If there will be last name in the future, we can use it here

  return `${firstInitial}${lastInitial}`.toUpperCase();
}
