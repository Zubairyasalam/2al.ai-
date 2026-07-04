import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { plan, billing = "yearly" } = body;

    if (!plan) {
      return NextResponse.json({ message: "Plan is required" }, { status: 400 });
    }

    // Map plan to USD Price
    let usdPrice = 0;
    const planName = plan.toLowerCase();

    if (planName === "micro") {
      usdPrice = billing === "yearly" ? 490 : 49;
    } else if (planName === "business") {
      usdPrice = billing === "yearly" ? 1490 : 149;
    } else if (planName === "advanced") {
      usdPrice = billing === "yearly" ? 3990 : 399;
    } else {
      return NextResponse.json({ message: "Invalid plan selected" }, { status: 400 });
    }

    // Convert USD to INR (approx 85 INR per USD) for Razorpay native currency support
    const exchangeRate = 85;
    const inrAmount = usdPrice * exchangeRate;
    const amountInPaise = Math.round(inrAmount * 100);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if keys are configured
    if (!keyId || !keySecret) {
      console.warn("[Razorpay] Warning: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured. Falling back to sandbox order generation.");
      
      // Return a simulated/mock order structure
      return NextResponse.json({
        mock: true,
        orderId: `order_mock_${Math.random().toString(36).substring(2, 9)}`,
        amount: amountInPaise,
        currency: "INR",
        plan,
        usdPrice
      });
    }

    // Initialize Razorpay
    const Razorpay = (await import("razorpay")).default;
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret
    });

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    });

    return NextResponse.json({
      mock: false,
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      plan,
      usdPrice
    });

  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json({ message: "Failed to initialize payment order" }, { status: 500 });
  }
}
