import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * One-time admin setup endpoint.
 * Creates the first admin user from environment variables.
 * Only runs if no users exist yet.
 * 
 * Call once after deployment: POST /api/admin/setup
 */
export async function POST() {
  try {
    const existingUsers = await db.user.count();
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: "Setup already complete. Admin user already exists." },
        { status: 409 }
      );
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD must be at least 8 characters." },
        { status: 400 }
      );
    }

    const passwordHash = await hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        name: "Muhammad Haashid",
        role: "OWNER",
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    // Log the action
    await db.auditLog.create({
      data: {
        userId: user.id,
        action: "setup",
        entityType: "User",
        entityId: user.id,
        entityTitle: user.email,
        metadata: { event: "first_admin_created" },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully.",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err: unknown) {
    console.error("[Setup] Error:", err);
    return NextResponse.json(
      { error: "Setup failed. Check server logs." },
      { status: 500 }
    );
  }
}
