import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import jsPDF from "jspdf";
import { formatDate } from "@/app/utils/format-date";
import { formatCurrency } from "@/app/utils/format-currency";
import fs from "fs";
import path from "path";

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

  // Add logo
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoData = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;
    pdf.addImage(logoBase64, "PNG", 15, 10, 25, 25);
  } catch (error) {
    console.error("Error loading logo:", error);
  }

  // Document border
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.5);
  pdf.rect(10, 10, 190, 277);

  // Invoice title and number badge
  pdf.setFontSize(28);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(15, 23, 42);
  pdf.text("INVOICE", 150, 25);

  // Invoice number badge
  pdf.setFillColor(216, 180, 226);
  pdf.roundedRect(145, 30, 50, 10, 2, 2, "F");
  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(`#${data.invoiceNumber}`, 170, 36, { align: "center" });

  // Reset text color
  pdf.setTextColor(15, 23, 42);

  // From section with background
  pdf.setFillColor(241, 245, 249);
  pdf.roundedRect(15, 45, 85, 30, 2, 2, "F");
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("FROM", 18, 52);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.fromName, 18, 58);
  pdf.text(data.fromEmail, 18, 63);
  const fromAddressLines = pdf.splitTextToSize(data.fromAddress, 75);
  pdf.text(fromAddressLines, 18, 68);

  // Bill to section with background
  pdf.setFillColor(241, 245, 249);
  pdf.roundedRect(105, 45, 85, 30, 2, 2, "F");
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("BILL TO", 108, 52);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.clientName, 108, 58);
  pdf.text(data.clientEmail, 108, 63);
  const clientAddressLines = pdf.splitTextToSize(data.clientAddress, 75);
  pdf.text(clientAddressLines, 108, 68);

  // Invoice details section
  pdf.setFillColor(241, 245, 249);
  pdf.roundedRect(15, 82, 175, 20, 2, 2, "F");

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("Invoice Date:", 18, 89);
  pdf.text("Due Date:", 18, 96);
  pdf.text("Status:", 95, 89);
  pdf.text("Currency:", 95, 96);

  pdf.setFont("helvetica", "normal");
  pdf.text(formatDate(data.date), 45, 89);
  pdf.text(`${data.dueDate} days`, 45, 96);

  // Status badge
  if (data.status === "PAID") {
    pdf.setFillColor(34, 197, 94);
  } else if (data.status === "PENDING") {
    pdf.setFillColor(234, 179, 8);
  } else {
    pdf.setFillColor(239, 68, 68);
  }
  pdf.roundedRect(110, 85, 20, 6, 1, 1, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(8);
  pdf.text(data.status, 120, 89, { align: "center" });
  pdf.setTextColor(15, 23, 42);

  pdf.setFontSize(9);
  pdf.text(data.currency, 115, 96);

  // Table header with background
  const tableTop = 115;
  pdf.setFillColor(15, 23, 42);
  pdf.roundedRect(15, tableTop, 175, 10, 2, 2, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.text("Description", 18, tableTop + 7);
  pdf.text("Qty", 120, tableTop + 7, { align: "center" });
  pdf.text("Rate", 145, tableTop + 7, { align: "right" });
  pdf.text("Amount", 185, tableTop + 7, { align: "right" });

  // Table rows with alternating colors
  let yOffset = tableTop + 15;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(15, 23, 42);

  data.items.forEach(
    (
      item: { description: string; quantity: number; amount: number },
      index: number
    ) => {
      // Alternating row background
      if (index % 2 === 0) {
        pdf.setFillColor(250, 250, 250);
        pdf.rect(15, yOffset - 5, 175, 8, "F");
      }

      pdf.text(item.description, 18, yOffset);
      pdf.text(item.quantity.toString(), 120, yOffset, { align: "center" });
      pdf.text(formatCurrency(item.amount, data.currency), 145, yOffset, {
        align: "right",
      });
      pdf.text(
        formatCurrency(item.quantity * item.amount, data.currency),
        185,
        yOffset,
        { align: "right" }
      );
      yOffset += 8;
    }
  );

  // Separator line
  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.line(15, yOffset + 2, 190, yOffset + 2);

  // Total section with background
  yOffset += 10;
  const totalAmount = data.items.reduce(
    (sum, item: { quantity: number; amount: number }) =>
      sum + item.quantity * item.amount,
    0
  );

  pdf.setFillColor(216, 180, 226);
  pdf.roundedRect(130, yOffset - 3, 60, 12, 2, 2, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(15, 23, 42);
  pdf.text("TOTAL:", 135, yOffset + 5);
  pdf.text(formatCurrency(totalAmount, data.currency), 185, yOffset + 5, {
    align: "right",
  });

  // Additional notes section
  if (data.note) {
    yOffset += 25;
    pdf.setFillColor(241, 245, 249);
    pdf.roundedRect(15, yOffset - 5, 175, 25, 2, 2, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Notes:", 18, yOffset + 2);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    const noteLines = pdf.splitTextToSize(data.note, 165);
    pdf.text(noteLines, 18, yOffset + 8);
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setFont("helvetica", "italic");
  pdf.setTextColor(100, 116, 139);
  pdf.text("Thank you for your business!", 105, 280, { align: "center" });

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
