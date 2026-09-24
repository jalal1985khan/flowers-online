import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password, requiredPortal } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Role-based portal validation
    if (requiredPortal === "ADMIN" && user.role !== "SUPER_ADMIN" && user.role !== "OPERATIONS") {
      return NextResponse.json(
        { error: "Unauthorized. This portal is restricted to Super Admins." },
        { status: 403 }
      );
    }

    if (
      requiredPortal === "VENDOR" &&
      user.role !== "VENDOR_OWNER" &&
      user.role !== "VENDOR_STAFF" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized. This portal is restricted to registered Vendor Partners." },
        { status: 403 }
      );
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name || "User",
      role: user.role,
      vendorId: user.vendorId,
    });

    let redirectUrl = "/";
    if (user.role === "SUPER_ADMIN") redirectUrl = "/admin";
    else if (user.role === "VENDOR_OWNER" || user.role === "VENDOR_STAFF") redirectUrl = "/vendor";
    else redirectUrl = "/account";

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        vendorId: user.vendorId,
      },
      redirectUrl,
    });

    response.cookies.set("bloom_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
