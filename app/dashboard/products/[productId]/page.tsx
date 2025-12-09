import { requireUser } from "@/app/utils/hooks";
import prisma from "@/lib/prisma";
import CreateEditProduct from "@/components/products/create-edit-product";
import { notFound } from "next/navigation";

async function getData(productId: string, userId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ productId: string }>;

export default async function EditProductPage(props: { params: Params }) {
  const params = await props.params;
  const session = await requireUser();
  const data = await getData(params.productId, session.user?.id as string);

  return <CreateEditProduct data={data} />;
}
