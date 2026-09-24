import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        phone: phone || null,
        password: hashedPassword,
        role: Role.CUSTOMER,
      },
    });

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name || "Customer",
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      redirectUrl: "/account",
    });

    response.cookies.set("bloom_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error("Register error:", error);
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
