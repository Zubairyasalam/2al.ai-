import { NextResponse } from "next/server";
import prisma from "@/lib/db";

// Handle User Role Update
export async function PUT(req: Request) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ message: "User ID and Role are required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("User role update error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Handle User Deletion
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("User deletion error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
