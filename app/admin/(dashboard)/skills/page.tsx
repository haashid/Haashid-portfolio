import { db } from "@/lib/db";
import { SkillsManager } from "./skills-manager";

export const dynamic = "force-dynamic";

export default async function SkillsAdminPage() {
  const categories = await db.skillCategory.findMany({
      orderBy: { displayOrder: "asc" },
      include: { skills: { orderBy: { displayOrder: "asc" } } },
    });
  return <SkillsManager initialCategories={categories} />;
}
