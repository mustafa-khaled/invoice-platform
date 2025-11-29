import { requireUser } from "@/app/utils/hooks";
import EditInvoice from "@/components/edit-invoice";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getInvoiceData(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId, userId: userId },
    include: {
      items: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ invoiceId: string }>;

export default async function EditInvoiceRoute({ params }: { params: Params }) {
  const { invoiceId } = await params;
  const session = await requireUser();

  const invoiceData = await getInvoiceData(
    invoiceId,
    session?.user?.id as string
  );

  return <EditInvoice data={invoiceData} />;
}
