import { db } from "@/lib/db";
import { auth } from "@/auth";

type AuditInput = {
  action: string;
  entityType: string;
  entityId?: string;
  entityTitle?: string;
  metadata?: Record<string, unknown>;
};

export async function logAudit(input: AuditInput) {
  try {
    const session = await auth();
    await db.auditLog.create({
      data: {
        userId: session?.user?.id ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        entityTitle: input.entityTitle,
        metadata: (input.metadata ?? {}) as any,
      },
    });
  } catch {
    // Audit logging should never crash the main flow
    console.error("[AuditLog] Failed to write audit entry");
  }
}

export async function createVersion(
  entityType: string,
  entityId: string,
  entityTitle: string | undefined,
  snapshot: Record<string, unknown>,
  changeNote?: string
) {
  try {
    const session = await auth();
    await db.contentVersion.create({
      data: {
        userId: session?.user?.id ?? null,
        entityType,
        entityId,
        entityTitle,
        snapshot: snapshot as any,
        changeNote,
      },
    });
  } catch {
    console.error("[ContentVersion] Failed to create version");
  }
}
