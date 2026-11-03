/**
 * lib/data.ts — Static data has been migrated to the database.
 *
 * This file previously contained hard-coded portfolio content (projects,
 * achievements, leadership, skills, etc.). All editable portfolio content
 * is now read from the database via lib/public-data.ts.
 *
 * The public frontend (app/page.tsx → components/portfolio-page.tsx)
 * receives database data as props from the server component.
 *
 * This file is kept minimal for backward compatibility.
 * No portfolio content should be sourced from this file.
 */

export { resolveIcon, trophyIcon } from "@/lib/icon-registry";
