import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, website } = body;

    if (!name || !email || !phone || !website) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const dataPath = path.join(process.cwd(), "src/data/demo-requests.json");
    
    let requests = [];
    try {
      const fileData = await fs.readFile(dataPath, "utf-8");
      requests = JSON.parse(fileData);
    } catch (e) {
      // File doesn't exist or is empty, start with empty array
    }

    const newRequest = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      phone,
      website,
      createdAt: new Date().toISOString()
    };

    requests.unshift(newRequest);
    await fs.writeFile(dataPath, JSON.stringify(requests, null, 2), "utf-8");

    // Trigger SMTP notification (non-blocking)
    try {
      const { sendDemoNotificationEmail } = await import("@/lib/mail");
      sendDemoNotificationEmail(
        process.env.SMTP_USER || "aiadmin@gmail.com",
        name,
        email,
        phone,
        website
      ).catch(e => console.error("Async email error:", e));
    } catch (e) {
      console.error("Failed to import mail utility", e);
    }

    return NextResponse.json({ message: "Demo scheduled successfully!", request: newRequest });
  } catch (err) {
    console.error("Failed to save demo request:", err);
    return NextResponse.json({ message: "Server error occurred" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), "src/data/demo-requests.json");
    let requests = [];
    try {
      const fileData = await fs.readFile(dataPath, "utf-8");
      requests = JSON.parse(fileData);
    } catch (e) {
      // Empty
    }
    return NextResponse.json({ requests });
  } catch (err) {
    return NextResponse.json({ requests: [] });
  }
}
