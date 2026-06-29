/**
 * Safely sanitizes user names by stripping HTML tags (e.g., XSS payloads)
 * and falling back to email prefixes or generic text if empty.
 */
export const getCleanName = (user) => {
  if (!user) return "";
  const name = user.name || "";
  // Regular expression to strip HTML tags safely
  const cleaned = name.replace(/<[^>]*>?/gm, "").trim();
  return cleaned || user.email?.split("@")[0] || "User";
};
