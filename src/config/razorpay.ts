import { projectId, publicAnonKey } from "../../utils/supabase/info"

const apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-232c1997`

interface RazorpayOrder {
  keyId: string
  orderId: string
  amount: number
  currency: string
  name: string
  description: string
}

export interface RazorpaySuccess {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export interface VerifiedPurchase {
  verified: true
  paymentId: string
  accessUrl: string | null
}

declare global {
  interface Window {
    Razorpay?: new (options: {
      key: string
      amount: number
      currency: string
      name: string
      description: string
      order_id: string
      image: string
      theme: { color: string }
      handler: (response: RazorpaySuccess) => void
      modal: { ondismiss: () => void }
    }) => { open: () => void }
  }
}

async function apiRequest<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${publicAnonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const result = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(result?.error || "Payment service is unavailable")
  }
  if (!result) {
    throw new Error("Payment service returned an invalid response")
  }
  return result as T
}

export function createRazorpayOrder(courseId: string) {
  return apiRequest<RazorpayOrder>("/razorpay/order", { courseId })
}

export function verifyRazorpayPayment(
  courseId: string,
  response: RazorpaySuccess,
) {
  return apiRequest<VerifiedPurchase>("/razorpay/verify", {
    courseId,
    razorpayOrderId: response.razorpay_order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature,
  })
}

export function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    )
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true })
      existing.addEventListener(
        "error",
        () => reject(new Error("Unable to load secure checkout")),
        { once: true },
      )
      return
    }

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      script.remove()
      reject(new Error("Unable to load secure checkout"))
    }
    document.body.appendChild(script)
  })
}
