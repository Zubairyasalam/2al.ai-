import { NextResponse } from "next/server";
import crypto from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { sendPaymentSuccessEmail } from "@/lib/mail";

// Since next-auth might not be accessible from raw node environment reliably inside API routes without standard wrappers,
// we will load Prisma to directly update the database by looking up the email passed in the request body.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      plan, 
      usdPrice, 
      email,
      mock = false
    } = body;

    if (!email || !plan || !usdPrice) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // 1. Signature Verification
    if (!mock && keySecret) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ message: "Payment signature verification failed. Possible fraud attempt detected." }, { status: 400 });
      }
    } else {
      console.log("[Razorpay] Skipping cryptographic signature check: running in Sandbox Mock Mode.");
    }

    // 2. Update Subscription in database
    // We import Prisma client dynamically to prevent import engines locks
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return NextResponse.json({ message: "User account not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        plan: plan.toUpperCase(),
        paymentStatus: "PAID"
      }
    });

    // 3. Send Success Receipt Email
    try {
      await sendPaymentSuccessEmail(
        updatedUser.email || email,
        updatedUser.name || "Subscriber",
        plan,
        usdPrice
      );
    } catch (e) {
      console.error("[Verify API] Nodemailer trigger failed:", e);
    }

    return NextResponse.json({ 
      message: "Payment verified and subscription activated successfully!",
      user: {
        email: updatedUser.email,
        plan: updatedUser.plan,
        paymentStatus: updatedUser.paymentStatus
      }
    });

  } catch (err) {
    console.error("Payment verification failed:", err);
    return NextResponse.json({ message: "Internal server error during verification" }, { status: 500 });
  }
}
