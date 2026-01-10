"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export async function createPayment(formData: FormData) {
  const invoiceId = formData.get("invoiceId") as string;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: true },
  });

  if (!invoice) {
    return redirect("/");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: invoice.items.map((item) => ({
      price_data: {
        currency: invoice.currency.toLowerCase(),
        product_data: {
          name: item.description,
        },
        unit_amount: Math.round(item.amount * 100), // Stripe expects cents
      },
      quantity: 1, // Quantity is already factored into amount ideally, but here amount is rate * quantity.
      // Wait, item.amount in Schema is usually "total for that item line".
      // Let's check Schema: quantity Int, rate Float, amount Float.
      // Usually amount = quantity * rate.
      // If we pass 1 here, we should use the item.amount.
    })),
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&invoiceId=${invoiceId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/invoice/${invoiceId}`,
    metadata: {
      invoiceId: invoiceId,
    },
  });

  return redirect(session.url as string);
}
