import { getAll } from "./store";
import { statusOf } from "./dates";
import type { Opportunity } from "./types";

/** All items that are not closed, newest first. */
export async function getActive(): Promise<Opportunity[]> {
  const all = await getAll();
  return all.filter((o) => statusOf(o) !== "closed");
}
