import { loadEnvConfig } from "@next/env";
import { defineCliConfig } from "sanity/cli";

// Load .env.local so the Sanity CLI uses the same project as the website.
loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineCliConfig({ api: { projectId, dataset } });
