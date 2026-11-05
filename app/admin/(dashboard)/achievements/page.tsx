import { db } from "@/lib/db";
import { AchievementsManager } from "./_components/achievements-manager";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function AchievementsAdminPage() {
  let achievements: any[] = [];
  try {
    achievements = await db.achievement.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
  } catch (err) {
    console.warn("[admin-achievements] DB unavailable:", err);
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Achievements</h1>
          <p className="admin-page-desc">Manage hackathon wins, awards, and recognitions</p>
        </div>
        <Link href="/admin/achievements/new" className="admin-btn admin-btn-primary">
          <Plus size={15} /> Add Achievement
        </Link>
      </div>
      <AchievementsManager initialAchievements={achievements} />
    </div>
  );
}
