import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import { formatDate } from "@/app/utils/format-date";
import { formatCurrency } from "@/app/utils/format-currency";

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  const { invoiceId } = await params;

  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      items: true,
      user: true,
    },
  });

  if (!data) {
    return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  pdf.setFont("helvetica");
  pdf.setFontSize(24);
  pdf.text(data?.invoiceName, 20, 20);

  //   From section
  pdf.setFontSize(12);
  pdf.text("From:", 20, 40);
  pdf.setFontSize(10);
  pdf.text([data.fromName, data.fromEmail, data.fromAddress], 20, 45);

  //   To section
  pdf.setFontSize(12);
  pdf.text("Bill to:", 20, 70);
  pdf.setFontSize(10);
  pdf.text([data.clientName, data.clientEmail, data.clientAddress], 20, 75);

  //   Invoice details
  pdf.setFontSize(12);
  pdf.text(`Invoice Number: ${data.invoiceName}`, 120, 40);
  pdf.text(`Date: ${formatDate(data.date)}`, 120, 47);
  pdf.text(`Due Date: ${data.dueDate}`, 120, 54);
  pdf.text(`Status: ${data.status}`, 120, 61);

  //   Table headers
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Item", 20, 100);
  pdf.text("Quantity", 100, 100);
  pdf.text("Price", 140, 100);
  pdf.text("Total", 170, 100);

  //   Draw line under headers
  pdf.line(20, 102, 190, 102);

  //   Table rows
  let yOffset = 110;
  pdf.setFont("helvetica", "normal");
  data.items.forEach((item) => {
    pdf.text(item.description, 20, yOffset);
    pdf.text(item.quantity.toString(), 100, yOffset);
    pdf.text(`${formatCurrency(item.amount, data.currency)}`, 140, yOffset);
    pdf.text(
      `${formatCurrency(item.quantity * item.amount, data.currency)}`,
      170,
      yOffset
    );
    yOffset += 10;
  });
  //   Draw line above total
  pdf.line(20, yOffset, 190, yOffset);

  //   Total amount
  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.quantity * item.amount,
    0
  );
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `Total: ${formatCurrency(totalAmount, data.currency)}`,
    160,
    yOffset + 10
  );

  //   Additional notes
  if (data.note) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Note:", 20, yOffset + 30);
    pdf.text(data.note, 20, yOffset + 36);
  }

  //  Generate PDF as buffer
  const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      //   NOTE: If you want to force download, uncomment the line below
      //   "Content-Disposition": `attachment; filename=${data.invoiceName}.pdf`,
      "Content-Disposition": "inline",
    },
  });
}
