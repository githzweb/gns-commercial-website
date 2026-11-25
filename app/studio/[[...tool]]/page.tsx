// Sanity Studio – the staff editing screen, available at /studio.
// Staff must log in with their Sanity account to edit anything.

import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
