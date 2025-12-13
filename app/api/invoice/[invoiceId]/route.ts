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

  // Add logo (top left)
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoData = fs.readFileSync(logoPath);
    const logoBase64 = `data:image/png;base64,${logoData.toString("base64")}`;
    pdf.addImage(logoBase64, "PNG", 20, 20, 20, 20);
  } catch (error) {
    // If logo fails, show text placeholder
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text("YOUR", 20, 28);
    pdf.text("LOGO", 20, 34);
  }

  // Invoice number (top right)
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100, 100, 100);
  pdf.text(`NO. ${String(data.invoiceNumber).padStart(6, "0")}`, 190, 25, {
    align: "right",
  });

  // Large INVOICE title
  pdf.setFontSize(48);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("INVOICE", 20, 70);

  // Date
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("Date:", 20, 85);
  pdf.setFont("helvetica", "normal");
  pdf.text(formatDate(data.date), 38, 85);

  // Billed to and From sections (side by side)
  const leftCol = 20;
  const rightCol = 110;
  const sectionTop = 100;

  // Billed to (left)
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("Billed to:", leftCol, sectionTop);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.clientName ?? "", leftCol, sectionTop + 7);
  pdf.text(data.clientAddress ?? "", leftCol, sectionTop + 13);
  pdf.text(data.clientEmail ?? "", leftCol, sectionTop + 19);

  // From (right)
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("From:", rightCol, sectionTop);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.fromName ?? "", rightCol, sectionTop + 7);
  pdf.text(data.fromAddress ?? "", rightCol, sectionTop + 13);
  pdf.text(data.fromEmail ?? "", rightCol, sectionTop + 19);

  // Table
  const tableTop = 145;
  const tableWidth = 170;
  const colWidths = {
    item: 70,
    quantity: 30,
    price: 35,
    amount: 35,
  };

  // Table header with light gray background
  pdf.setFillColor(240, 240, 240);
  pdf.rect(20, tableTop, tableWidth, 10, "F");

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(0, 0, 0);
  pdf.text("Item", 25, tableTop + 7);
  pdf.text("Quantity", 95, tableTop + 7, { align: "center" });
  pdf.text("Price", 130, tableTop + 7, { align: "center" });
  pdf.text("Amount", 185, tableTop + 7, { align: "right" });

  // Table rows
  let yOffset = tableTop + 17;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  data.items?.forEach(
    (item: {
      description: string;
      quantity: number;
      rate: number;
      amount: number;
    }) => {
      pdf.text(item.description ?? "", 25, yOffset);
      pdf.text((item.quantity ?? 0).toString(), 95, yOffset, {
        align: "center",
      });
      pdf.text(
        formatCurrency(item.amount ?? 0, data.currency ?? "USD"),
        130,
        yOffset,
        { align: "center" }
      );
      pdf.text(
        formatCurrency(
          (item.quantity ?? 0) * (item.amount ?? 0),
          data.currency ?? "USD"
        ),
        185,
        yOffset,
        { align: "right" }
      );
      yOffset += 10;
    }
  );

  // Total
  yOffset += 5;
  const totalAmount =
    data.items?.reduce(
      (sum: number, item: { quantity: number; rate: number; amount: number }) =>
        sum + (item.quantity ?? 0) * (item.amount ?? 0),
      0
    ) ?? 0;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Total", 150, yOffset);
  pdf.text(formatCurrency(totalAmount, data.currency ?? "USD"), 185, yOffset, {
    align: "right",
  });

  // Payment method and notes
  yOffset += 20;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("Payment method:", 20, yOffset);
  pdf.setFont("helvetica", "normal");
  pdf.text(data.status === "PAID" ? "Paid" : "Pending", 60, yOffset);

  if (data.note) {
    yOffset += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Note:", 20, yOffset);
    pdf.setFont("helvetica", "normal");
    const noteLines = pdf.splitTextToSize(data.note, 170);
    pdf.text(noteLines, 35, yOffset);
  }

  // Decorative wave footer using polygons
  const waveStart = 240;

  // First wave (light gray) - using polygon points
  pdf.setFillColor(200, 200, 200);
  const wave1Points = [
    [0, waveStart + 30],
    [30, waveStart + 25],
    [60, waveStart + 20],
    [90, waveStart + 25],
    [120, waveStart + 30],
    [150, waveStart + 25],
    [180, waveStart + 20],
    [210, waveStart + 25],
    [210, 297],
    [0, 297],
  ];

  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0);
  for (let i = 0; i < wave1Points.length - 1; i++) {
    if (i === 0) {
      pdf.moveTo(wave1Points[i][0], wave1Points[i][1]);
    }
    pdf.lineTo(wave1Points[i + 1][0], wave1Points[i + 1][1]);
  }
  pdf.fill();

  // Second wave (darker gray)
  pdf.setFillColor(100, 100, 100);
  const wave2Points = [
    [0, waveStart + 50],
    [40, waveStart + 55],
    [80, waveStart + 45],
    [120, waveStart + 50],
    [160, waveStart + 55],
    [200, waveStart + 50],
    [210, waveStart + 52],
    [210, 297],
    [0, 297],
  ];

  pdf.setDrawColor(100, 100, 100);
  for (let i = 0; i < wave2Points.length - 1; i++) {
    if (i === 0) {
      pdf.moveTo(wave2Points[i][0], wave2Points[i][1]);
    }
    pdf.lineTo(wave2Points[i + 1][0], wave2Points[i + 1][1]);
  }
  pdf.fill();

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
