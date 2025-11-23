"use server";

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "./utils/hooks";
import { invoiceSchema, onboardingSchema } from "./utils/zod-schemas";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function onboardUser(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { firstName, lastName, address } = submission.value;

  const data = await prisma.user.update({
    where: { id: session?.user?.id },
    data: {
      firstName,
      lastName,
      address,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  // Parse and validate form data
  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const {
    invoiceName,
    invoiceNumber,
    status,
    date,
    dueDate,
    currency,
    fromName,
    fromEmail,
    fromAddress,
    clientName,
    clientEmail,
    clientAddress,
    note,
    items,
  } = submission.value;

  // Compute amounts from items (server-side security)
  const validatedItems = items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.quantity * item.rate,
  }));

  const computedTotal = validatedItems.reduce(
    (acc, item) => acc + item.amount,
    0
  );

  try {
    const invoice = await prisma.invoice.create({
      data: {
        invoiceName,
        invoiceNumber,
        status,
        date,
        dueDate,
        currency,
        fromName,
        fromEmail,
        fromAddress,
        clientName,
        clientEmail,
        clientAddress,
        total: computedTotal,
        note: note || null,
        userId: session?.user?.id,
        items: {
          create: validatedItems,
        },
      },
      include: {
        items: true,
      },
    });

    await redirect("/dashboard/invoices");
  } catch (error) {
    console.error("❌ ERROR creating invoice:", error);

    // Log more details
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    // Don't catch Next.js redirects
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      console.log("This is a redirect, rethrowing...");
      throw error;
    }

    return {
      status: "error" as const,
      error: {
        "": [
          `Failed to create invoice: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        ],
      },
    };
  }
}
