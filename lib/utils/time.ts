export function formatTo12Hour(timeStr: string | undefined | null): number {
  // 1. Convert string to integer, fallback to 0 if invalid
  const hour24 = parseInt(timeStr || "0", 10) || 0;

  // 2. Convert 24h to 12h format
  const hour12 = hour24 % 12;

  // 3. Handle 0/12 (midnight/noon) edge cases
  return hour12 === 0 ? 12 : hour12;
}