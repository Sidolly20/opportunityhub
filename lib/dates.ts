import type { Opportunity } from "./types";

export type Status = "closed" | "closing-soon" | "open" | "rolling" | "news";

/** Days left until the deadline. null = no deadline. -1 = already closed. */
export function daysLeft(deadline: string | null): number | null {
  if (!deadline) return null;
  const end = Date.parse(`${deadline}T23:59:59Z`);
  if (isNaN(end)) return null;
  const diff = end - Date.now();
  if (diff < 0) return -1;
  return Math.ceil(diff / 86_400_000);
}

export function statusOf(o: Opportunity): Status {
  if (o.category === "News") return "news";
  const d = daysLeft(o.deadline);
  if (d === null) return "rolling";
  if (d < 0) return "closed";
  if (d <= 14) return "closing-soon";
  return "open";
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function countdownText(deadline: string | null): string {
  const d = daysLeft(deadline);
  if (d === null) return "No fixed deadline";
  if (d < 0) return "Closed";
  if (d === 0) return "Closes today";
  if (d === 1) return "1 day left";
  return `${d} days left`;
}
