import { requireUser } from "@/app/utils/hooks";
import CreateEditInvoice from "@/components/create-edit-invoice";
import prisma from "@/lib/prisma";

async function getUserData(userId: string) {
  const [user, customers, products] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        address: true,
        email: true,
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

  return { user, customers, products };
}

export default async function CreateInvoicePage() {
  const session = await requireUser();

  const { user, customers, products } = await getUserData(
    session?.user?.id as string
  );

  return (
    <CreateEditInvoice
      firstName={user?.firstName as string}
      lastName={user?.lastName as string}
      address={user?.address as string}
      email={user?.email as string}
      customers={customers}
      products={products}
    />
  );
}
