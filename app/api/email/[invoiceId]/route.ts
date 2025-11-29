import { formatDate } from "@/app/utils/format-date";
import { requireUser } from "@/app/utils/hooks";
import {
  mailClient,
  mailtrapRecipients,
  mailtrapSender,
} from "@/app/utils/mailtrap";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  try {
    const { invoiceId } = await params;

    const session = await requireUser();

    if (!invoiceId) {
      return notFound();
    }

    const invoiceData = await prisma.invoice.findUnique({
      where: { id: invoiceId, userId: session?.user?.id as string },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Send email notification about the updated invoice
    mailClient.send({
      from: mailtrapSender,
      to: mailtrapRecipients,
      template_uuid: "3c8f51d6-8c5f-41c8-8ee3-aa302e2f769c",
      template_variables: {
        clientName: invoiceData.clientName,
        INVOICE_NUMBER: invoiceData.invoiceNumber,
        ISSUE_DATE: formatDate(invoiceData.date),
        DUE_DATE: invoiceData.dueDate || "N/A",
        AMOUNT: invoiceData.total,
        CURRENCY: invoiceData.currency,
        INVOICE_URL: `${process.env.NEXT_PUBLIC_APP_URL}/api/invoice/${invoiceId}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "An error occurred while sending the email." },
      { status: 500 }
    );
  }
}
