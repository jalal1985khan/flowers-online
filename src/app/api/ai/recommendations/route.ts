import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RecommendationStatus } from "@prisma/client";

export async function GET() {
  try {
    const recommendations = await prisma.aIRecommendation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ recommendations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: "Recommendation id and action are required" }, { status: 400 });
    }

    const rec = await prisma.aIRecommendation.findUnique({
      where: { id },
    });

    if (!rec) {
      return NextResponse.json({ error: "Recommendation not found" }, { status: 404 });
    }

    let nextStatus: RecommendationStatus = rec.status;
    if (action === "APPROVE") {
      nextStatus = RecommendationStatus.APPROVED;
    } else if (action === "APPLY") {
      nextStatus = RecommendationStatus.APPLIED;
    } else if (action === "REJECT") {
      nextStatus = RecommendationStatus.REJECTED;
    }

    const updated = await prisma.aIRecommendation.update({
      where: { id },
      data: {
        status: nextStatus,
        appliedAt: action === "APPLY" ? new Date() : rec.appliedAt,
      },
    });

    // Write to AuditLog
    await prisma.auditLog.create({
      data: {
        actorEmail: "admin@bloomandbakes.com",
        actorRole: "SUPER_ADMIN",
        action: `AI_RECOMMENDATION_${action}`,
        entityType: "AI_RECOMMENDATION",
        entityId: id,
        diff: JSON.stringify({ previousStatus: rec.status, newStatus: nextStatus }),
      },
    });

    return NextResponse.json({ success: true, recommendation: updated });
  } catch (error: any) {
    console.error("AI recommendation update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
