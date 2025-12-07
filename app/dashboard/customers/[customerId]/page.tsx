import { requireUser } from "@/app/utils/hooks";
import CreateEditCustomer from "@/components/create-edit-customer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

async function getCustomerData(customerId: string, userId: string) {
  const data = await prisma.customer.findUnique({
    where: { id: customerId, userId: userId },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ customerId: string }>;

export default async function EditInvoiceRoute({ params }: { params: Params }) {
  const { customerId } = await params;
  const session = await requireUser();

  const customerData = await getCustomerData(
    customerId,
    session?.user?.id as string
  );

  return <CreateEditCustomer customerData={customerData} />;
}
