import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Activity } from "lucide-react";

export default async function ActivityAdminPage() {
  let logs: any[] = [];
  try {
    logs = await db.auditLog.findMany({
      take: 100,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });
  } catch (error) {
    console.warn("[admin-activity] findMany failed, using empty array:", error);
    logs = [];
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Activity Log</h1>
          <p className="admin-page-desc">Track all changes made to your portfolio</p>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon"><Activity size={40} /></div>
          <h3>No activity yet</h3>
          <p>Actions you take in the admin panel will appear here.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Action</th><th>Entity</th><th>User</th><th>Time</th></tr></thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span style={{
                      padding: "3px 8px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700,
                      background: log.action === "published" ? "rgba(74,222,128,0.12)" :
                                  log.action === "created" ? "rgba(56,189,248,0.12)" :
                                  log.action === "deleted" || log.action === "archived" ? "rgba(248,113,113,0.12)" :
                                  "rgba(251,191,36,0.1)",
                      color: log.action === "published" ? "#4ade80" :
                             log.action === "created" ? "#38bdf8" :
                             log.action === "deleted" || log.action === "archived" ? "#f87171" : "#fbbf24",
                    }}>
                      {log.action.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 500, color: "#f4f4f5" }}>{log.entityType}</div>
                    {log.entityTitle && <div style={{ fontSize: "0.78rem", color: "#71717a" }}>{log.entityTitle}</div>}
                  </td>
                  <td style={{ color: "#71717a", fontSize: "0.82rem" }}>{log.user?.name || log.user?.email || "System"}</td>
                  <td style={{ color: "#71717a", fontSize: "0.82rem" }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
