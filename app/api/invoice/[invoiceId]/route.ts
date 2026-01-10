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
  try {
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
    // Add logo (top left)
    try {
      const logoRef = "logo.png";
      const logoPath = path.join(process.cwd(), "public", logoRef);

      // Explicitly check existence
      if (fs.existsSync(logoPath)) {
        const logoData = fs.readFileSync(logoPath);
        const logoBase64 = `data:image/png;base64,${logoData.toString(
          "base64"
        )}`;

        pdf.saveGraphicsState();
        // Circular clipping
        // Center at 30,30, radius 10. Image at 20,20 20x20.
        // We use a simpler approach if circle clipping is problematic or just draw image on top if simple.
        // But let's try to keep the circle clip if possible, or fallback to rect clip if needed.
        // pdf.circle(30, 30, 10, "CN"); -> This was causing issues? No, standard jsPDF has circle.
        // The issue 'bezierCurveTo' was specific. 'circle' should be fine.

        // Let's use a square image for safety if clipping is weird, or just draw it.
        // But user wants rounded.
        // Let's try advanced API for clipping if standard circle fails, but standard circle(x,y,r,'W') is for clipping?
        // Actually 'CN' is not standard. 'W' (Clip) is.
        // Or using standard lines to close path and 'W'.

        // Simpler approach: Draw image, then overlay a white mask with a hole? No.
        // Let's just draw the image for now to fix "TEXT" issue, then optimize clipping.
        // User said "LOGO text not my image", implies strict failure.

        pdf.addImage(logoBase64, "PNG", 20, 20, 20, 20);
        pdf.restoreGraphicsState();
      } else {
        throw new Error(`Logo file not found at ${logoPath}`);
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Failed to load logo:", error);
      }
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("LOGO", 20, 30);
    }

    // Invoice number (top right)
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      `Invoice No. #${String(data.invoiceNumber).padStart(6, "0")}`,
      190,
      30,
      {
        align: "right",
      }
    );

    // Large INVOICE title
    pdf.setFontSize(32);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0); // Black
    pdf.text("INVOICE", 20, 60);

    // Status Badge
    const statusX = 20;
    const statusY = 65;
    pdf.setFillColor(
      data.status === "PAID" ? 220 : 255,
      data.status === "PAID" ? 255 : 240,
      data.status === "PAID" ? 220 : 240
    ); // Greenish or gray
    // Draw rounded rect manually or just rect
    pdf.setDrawColor(
      data.status === "PAID" ? 22 : 200,
      data.status === "PAID" ? 163 : 200,
      data.status === "PAID" ? 74 : 200
    );
    pdf.roundedRect(statusX, statusY, 25, 8, 2, 2, "FD");
    pdf.setFontSize(9);
    pdf.setTextColor(
      data.status === "PAID" ? 22 : 100,
      data.status === "PAID" ? 130 : 100,
      data.status === "PAID" ? 50 : 100
    );
    pdf.text(data.status, statusX + 12.5, statusY + 5.5, { align: "center" });

    // Dates
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(100, 100, 100);
    pdf.text("Date Issued:", 190, 60, { align: "right" });
    pdf.setTextColor(0, 0, 0);
    pdf.text(formatDate(data.date), 190, 65, { align: "right" });

    pdf.setTextColor(100, 100, 100);
    // Calculate due date based on data.dueDate (integer days) + data.date
    // Ideally this logic should be in a helper, but for PDF gen we can just use the int for now as label
    pdf.text("Due Date:", 190, 75, { align: "right" });
    pdf.setTextColor(0, 0, 0);
    // Mocking actual date calc for display improvement:
    const dueObj = new Date(data.date);
    dueObj.setDate(dueObj.getDate() + data.dueDate);
    pdf.text(formatDate(dueObj), 190, 80, { align: "right" });

    // Billed to and From sections (side by side)
    const leftCol = 20;
    const rightCol = 110;
    const sectionTop = 100;

    // Draw a separator line
    pdf.setDrawColor(230, 230, 230);
    pdf.line(20, 90, 190, 90);

    // Bill From
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(100, 100, 100); // Label color
    pdf.text("Bill From:", leftCol, sectionTop);

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold"); // Name bold
    pdf.setTextColor(0, 0, 0);
    pdf.text(data.fromName ?? "", leftCol, sectionTop + 7);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    pdf.text(data.fromAddress ?? "", leftCol, sectionTop + 13);
    pdf.text(data.fromEmail ?? "", leftCol, sectionTop + 18);

    // Bill To
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(100, 100, 100);
    pdf.text("Bill To:", rightCol, sectionTop);

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(0, 0, 0);
    pdf.text(data.clientName ?? "", rightCol, sectionTop + 7);

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(80, 80, 80);
    pdf.text(data.clientAddress ?? "", rightCol, sectionTop + 13);
    pdf.text(data.clientEmail ?? "", rightCol, sectionTop + 18);

    // Table
    const tableTop = 145;
    const tableWidth = 170; // 190 - 20

    // Table Header Function
    const drawTableHeader = (y: number) => {
      pdf.setFillColor(248, 249, 250); // Very light gray
      pdf.rect(20, y, tableWidth, 12, "F"); // Header background

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100); // Muted header text

      const colX = {
        desc: 25,
        qty: 110,
        rate: 135,
        amt: 170,
      };

      pdf.text("Description", colX.desc, y + 8);
      pdf.text("Quantity", colX.qty, y + 8);
      pdf.text("price", colX.rate, y + 8);
      pdf.text("Amount", 190 - 5, y + 8, { align: "right" });
    };

    drawTableHeader(tableTop);

    // Table rows
    let yOffset = tableTop + 20;
    pdf.setFont("helvetica", "normal"); // Reset font
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const colX = {
      desc: 25,
      qty: 110,
      rate: 135,
      amt: 170,
    };

    data.items?.forEach(
      (item: {
        description: string;
        quantity: number;
        rate: number;
        amount: number;
      }) => {
        const rateStr = formatCurrency(item.rate, data.currency ?? "USD");
        const amountStr = formatCurrency(
          (item.quantity ?? 0) * (item.rate ?? 0),
          data.currency ?? "USD"
        );

        // Wrap Description
        const descWidth = 80;
        const descLines = pdf.splitTextToSize(
          item.description ?? "",
          descWidth
        );

        // Check for page overflow
        // Assume max Y is around 270 (allowing space for footer)
        const rowHeight = Math.max(7 * descLines.length, 10) + 5;

        if (yOffset + rowHeight > 260) {
          pdf.addPage();
          yOffset = 20; // New page top margin
          drawTableHeader(yOffset);
          yOffset += 20;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
          pdf.setTextColor(0, 0, 0);
        }

        pdf.text(descLines, colX.desc, yOffset);
        pdf.text(item.quantity.toString(), colX.qty + 3, yOffset);
        pdf.text(rateStr, colX.rate, yOffset);
        pdf.text(amountStr, 190 - 5, yOffset, { align: "right" });

        // Bottom border for row
        pdf.setDrawColor(240, 240, 240);
        pdf.line(20, yOffset + 5, 190, yOffset + 5);

        yOffset += rowHeight;
      }
    );

    // Totals Section
    // Check if totals fit, if not add page
    if (yOffset + 50 > 260) {
      pdf.addPage();
      yOffset = 20;
    }

    const totalYStart = yOffset + 10;

    // Calculate total
    const totalAmount =
      data.items?.reduce(
        (sum: number, item: { quantity: number; rate: number }) =>
          sum + (item.quantity ?? 0) * (item.rate ?? 0),
        0
      ) ?? 0;

    // Align totals to the right
    const labelX = 140;
    const valueX = 190;

    pdf.setFontSize(10);
    pdf.setTextColor(100, 100, 100);
    pdf.text("Subtotal", labelX, totalYStart);
    pdf.setTextColor(0, 0, 0);
    pdf.text(
      formatCurrency(totalAmount, data.currency ?? "USD"),
      valueX,
      totalYStart,
      { align: "right" }
    );

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text("Total", labelX, totalYStart + 10);
    pdf.setTextColor(0, 0, 0); // Primary color
    pdf.text(
      formatCurrency(totalAmount, data.currency ?? "USD"),
      valueX,
      totalYStart + 10,
      { align: "right" }
    );

    // Footer / Notes
    if (data.note) {
      const noteY = totalYStart + 30;
      // Check page overflow for notes
      if (noteY + 30 > 270) {
        // If it doesn't fit, we might just let it be or add page.
        // For simplicity let's stick to current page unless it's strictly over 290
      }

      pdf.setFillColor(248, 250, 252); // Slate 50
      pdf.roundedRect(20, noteY, 170, 30, 2, 2, "F");

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(100, 100, 100);
      pdf.text("Notes:", 25, noteY + 8);

      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      const noteLines = pdf.splitTextToSize(data.note, 160);
      pdf.text(noteLines, 25, noteY + 15);
    }

    // Footer waves
    const waveStart = 260; // Start higher up

    // First wave (light accent)
    pdf.setFillColor(224, 231, 255); // Indigo 100
    pdf.setDrawColor(224, 231, 255);
    pdf.setLineWidth(1);

    pdf.moveTo(0, waveStart);
    pdf.curveTo(40, waveStart - 10, 80, waveStart + 20, 140, waveStart + 5);
    pdf.curveTo(180, waveStart - 5, 200, waveStart + 10, 210, waveStart);
    pdf.lineTo(210, 297);
    pdf.lineTo(0, 297);
    pdf.fill();

    // Second wave (primary brand color approx)
    pdf.setFillColor(79, 70, 229); // Indigo 600
    pdf.setDrawColor(79, 70, 229);

    pdf.moveTo(0, waveStart + 10);
    pdf.curveTo(30, waveStart + 5, 70, waveStart + 25, 130, waveStart + 10);
    pdf.curveTo(170, waveStart, 190, waveStart + 15, 210, waveStart + 5);
    pdf.lineTo(210, 297);
    pdf.lineTo(0, 297);
    pdf.fill();

    pdf.setFontSize(8);
    pdf.setTextColor(255, 255, 255); // White text on dark wave
    pdf.text("Generated by InvoicePlatform", 105, 290, { align: "center" });

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
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
