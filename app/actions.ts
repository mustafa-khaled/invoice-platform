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

  // ——————————————————————————————
  // 1️): Compute amounts from items (server secure)
  // ——————————————————————————————
  const validatedItems = items.map((item) => ({
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.quantity * item.rate,
  }));

  // ——————————————————————————————
  // 2️): Compute TOTAL on server (NEVER trust client)
  // ——————————————————————————————
  const computedTotal = validatedItems.reduce(
    (acc, item) => acc + item.amount,
    0
  );

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
      note,

      items: { create: validatedItems },
    },
    include: { items: true },
  });

  return { success: true, invoiceId: invoice.id };
}
