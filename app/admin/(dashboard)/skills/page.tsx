import { db } from "@/lib/db";
import { SkillsManager } from "./skills-manager";

export const dynamic = "force-dynamic";

export default async function SkillsAdminPage() {
  let categories: any[] = [];
  try {
    categories = await db.skillCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: { skills: { orderBy: { displayOrder: "asc" } } },
    });
  } catch (err) {
    console.warn("[admin-skills] DB unavailable:", err);
  }
  return <SkillsManager initialCategories={categories} />;
}
