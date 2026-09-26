import { getSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAdminSession() {
  const session = await getSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "OPERATIONS")) {
    return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { session, error: null };
}
