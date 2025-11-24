"use server";

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "./utils/hooks";
import { invoiceSchema, onboardingSchema } from "./utils/zod-schemas";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  mailClient,
  mailtrapRecipients,
  mailtrapSender,
} from "./utils/mailtrap";
import { formatDate } from "./utils/format-date";

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

  mailClient.send({
    from: mailtrapSender,
    // TODO: You can customize the recipient email as needed if you added your own domain on Mailtrap
    to: mailtrapRecipients,
    template_uuid: "94447b52-fcb1-49e7-b92e-90910835df50",

    template_variables: {
      clientName: clientName,
      INVOICE_NUMBER: invoiceNumber,
      ISSUE_DATE: formatDate(date),
      DUE_DATE: dueDate,
      AMOUNT: computedTotal,
      CURRENCY: currency,
      INVOICE_URL: "Test_Invoice_url",
    },
  });

  return redirect("/dashboard/invoices");
}
