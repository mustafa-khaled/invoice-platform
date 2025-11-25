import { requireUser } from "@/app/utils/hooks";
import CreateInvoice from "@/components/create-invoice";
import prisma from "@/lib/prisma";

async function getUserData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      address: true,
      email: true,
    },
  });

  return data;
}

export default async function CreateInvoicePage() {
  const session = await requireUser();

  const data = await getUserData(session?.user?.id as string);

  return (
    <CreateInvoice
      firstName={data?.firstName as string}
      lastName={data?.lastName as string}
      address={data?.address as string}
      email={data?.email as string}
    />
  );
}
