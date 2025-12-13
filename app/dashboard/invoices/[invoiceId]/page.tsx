import { requireUser } from "@/app/utils/hooks";
import CreateEditInvoice from "@/components/create-edit-invoice";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getInvoiceData(invoiceId: string, userId: string) {
  const [data, customers, products] = await Promise.all([
    prisma.invoice.findUnique({
      where: { id: invoiceId, userId: userId },
      include: {
        items: true,
      },
    }),
    prisma.customer.findMany({
      where: { userId: userId },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
      },
    }),
    prisma.product.findMany({
      where: { userId: userId },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
      },
    }),
  ]);

  if (!data) {
    return notFound();
  }

  return { data, customers, products };
}

type Params = Promise<{ invoiceId: string }>;

export default async function EditInvoiceRoute({ params }: { params: Params }) {
  const { invoiceId } = await params;
  const session = await requireUser();

  const { data, customers, products } = await getInvoiceData(
    invoiceId,
    session?.user?.id as string
  );

  return (
    <CreateEditInvoice data={data} customers={customers} products={products} />
  );
}
