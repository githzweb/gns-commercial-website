import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

// Read-only client for the public website. It never uses a token, so it can
// only see published content.
export const client = createClient({
  projectId: projectId || "missing",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
