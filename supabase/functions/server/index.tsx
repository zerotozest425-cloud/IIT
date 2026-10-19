import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();
const routePrefix = "/make-server-232c1997";

const products = {
  canva: { name: "Canva Complete Course", amount: 19700 },
  "video-editing": {
    name: "Premiere Pro Video Editing Complete Course",
    amount: 19700,
  },
  chatgpt: { name: "ChatGPT Complete Course", amount: 19700 },
  "facebook-ads": {
    name: "Digital Marketing Full Course",
    amount: 19700,
  },
  wordpress: { name: "WordPress Complete Course", amount: 19700 },
  "3d-animation": {
    name: "3D Animation Complete Course",
    amount: 19700,
  },
  "motivational-ebooks": {
    name: "1000+ Motivational E-books",
    amount: 19700,
  },
  "all-courses": {
    name: "Ultimate Digital Skills Bundle",
    amount: 19900,
  },
} as const;

type CourseId = keyof typeof products;

interface StoredOrder {
  courseId: CourseId;
  amount: number;
  currency: "INR";
}

function getRazorpayCredentials() {
  const keyId = Deno.env.get("RAZORPAY_KEY_ID");
  const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are not configured");
  }
  return { keyId, keySecret };
}

function isCourseId(value: unknown): value is CourseId {
  return typeof value === "string" && value in products;
}

async function readPaymentPayload(request: Request) {
  if (request.method !== "GET") {
    return request.json().catch(() => null);
  }

  const encodedPayload = request.headers.get("X-Payment-Payload");
  if (!encodedPayload) return null;
  try {
    return JSON.parse(atob(encodedPayload));
  } catch {
    return null;
  }
}

function razorpayHeaders(keyId: string, keySecret: string) {
  return {
    Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
    "Content-Type": "application/json",
  };
}

async function readRazorpayResponse(response: Response) {
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    console.error(
      "Razorpay request failed",
      response.status,
      result?.error?.description ?? response.statusText,
    );
    throw new Error("Razorpay could not process the request");
  }
  return result;
}

function hexToBytes(value: string) {
  if (!/^[0-9a-f]{64}$/i.test(value)) return null;
  return new Uint8Array(
    value.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)),
  );
}

async function hasValidSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
) {
  const signatureBytes = hexToBytes(signature);
  if (!signatureBytes) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    signatureBytes,
    new TextEncoder().encode(`${orderId}|${paymentId}`),
  );
}

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "X-Payment-Payload"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get(`${routePrefix}/health`, (c) => {
  return c.json({ status: "ok" });
});

app.on(["GET", "POST"], `${routePrefix}/razorpay/order`, async (c) => {
  try {
    const body = await readPaymentPayload(c.req.raw);
    if (!isCourseId(body?.courseId)) {
      return c.json({ error: "Please select a valid course" }, 400);
    }

    const courseId = body.courseId;
    const product = products[courseId];
    const { keyId, keySecret } = getRazorpayCredentials();
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: razorpayHeaders(keyId, keySecret),
      body: JSON.stringify({
        amount: product.amount,
        currency: "INR",
        receipt: `iit-${courseId}-${Date.now()}`,
        notes: { courseId },
      }),
    });
    const order = await readRazorpayResponse(response);

    await kv.set(`razorpay-order:${order.id}`, {
      courseId,
      amount: product.amount,
      currency: "INR",
    } satisfies StoredOrder);

    c.header("Cache-Control", "no-store");
    return c.json(
      {
        keyId,
        orderId: order.id,
        amount: product.amount,
        currency: "INR",
        name: "Infinity Institute of Technology",
        description: product.name,
      },
      200,
    );
  } catch (error) {
    console.error("Could not create Razorpay order", error);
    const configurationError =
      error instanceof Error &&
      error.message === "Razorpay credentials are not configured";
    return c.json(
      {
        error: configurationError
          ? "Payment service is not configured yet"
          : "Unable to start payment right now",
      },
      503,
    );
  }
});

app.on(["GET", "POST"], `${routePrefix}/razorpay/verify`, async (c) => {
  try {
    const body = await readPaymentPayload(c.req.raw);
    const {
      courseId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = body ?? {};

    if (
      !isCourseId(courseId) ||
      typeof razorpayOrderId !== "string" ||
      typeof razorpayPaymentId !== "string" ||
      typeof razorpaySignature !== "string"
    ) {
      return c.json({ error: "Invalid payment verification details" }, 400);
    }

    const storedOrder = (await kv.get(
      `razorpay-order:${razorpayOrderId}`,
    )) as StoredOrder | undefined;
    const product = products[courseId];
    if (
      !storedOrder ||
      storedOrder.courseId !== courseId ||
      storedOrder.amount !== product.amount ||
      storedOrder.currency !== "INR"
    ) {
      return c.json({ error: "Payment order could not be verified" }, 400);
    }

    const { keyId, keySecret } = getRazorpayCredentials();
    if (
      !(await hasValidSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        keySecret,
      ))
    ) {
      return c.json({ error: "Payment signature is invalid" }, 400);
    }

    const paymentResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpayPaymentId)}`,
      { headers: razorpayHeaders(keyId, keySecret) },
    );
    const payment = await readRazorpayResponse(paymentResponse);
    if (
      payment.order_id !== razorpayOrderId ||
      payment.amount !== product.amount ||
      payment.currency !== "INR" ||
      !["authorized", "captured"].includes(payment.status)
    ) {
      return c.json({ error: "Payment has not been completed" }, 400);
    }

    await kv.set(`razorpay-payment:${razorpayPaymentId}`, {
      courseId,
      orderId: razorpayOrderId,
      amount: product.amount,
      verifiedAt: new Date().toISOString(),
    });

    const includesEbooks =
      courseId === "motivational-ebooks" || courseId === "all-courses";
    const accessUrl =
      courseId === "chatgpt"
        ? Deno.env.get("CHATGPT_ACCESS_URL") ?? null
        : courseId === "video-editing"
          ? Deno.env.get("VIDEO_EDITING_ACCESS_URL") ?? null
          : courseId === "facebook-ads"
            ? Deno.env.get("DIGITAL_MARKETING_ACCESS_URL") ?? null
            : includesEbooks
              ? Deno.env.get("EBOOK_ACCESS_URL") ?? null
              : null;
    c.header("Cache-Control", "no-store");
    return c.json(
      {
        verified: true,
        paymentId: razorpayPaymentId,
        accessUrl,
      },
      200,
    );
  } catch (error) {
    console.error("Could not verify Razorpay payment", error);
    return c.json({ error: "Unable to verify payment right now" }, 503);
  }
});

Deno.serve(app.fetch);
