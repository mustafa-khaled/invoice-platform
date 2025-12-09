import { deleteProduct } from "@/app/actions/products.action";
import SubmitButton from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { requireUser } from "@/app/utils/hooks";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getData(productId: string, userId: string) {
  const data = await prisma.product.findUnique({
    where: {
      id: productId,
      userId: userId,
    },
    select: {
      name: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

type Params = Promise<{ productId: string }>;

export default async function DeleteProductPage(props: { params: Params }) {
  const params = await props.params;
  const session = await requireUser();
  const data = await getData(params.productId, session.user?.id as string);

  return (
    <div className="flex flex-1 justify-center items-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Delete Product</CardTitle>
          <CardDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold">{data.name}</span>? This action
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center">
            <div className="p-4 rounded-full bg-red-100">
              <AlertTriangle className="size-8 text-red-500" />
            </div>
            <p className="text-center text-sm text-balance">
              This will permanently delete this product and remove it from our
              servers.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between w-full">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/products">Cancel</Link>
          </Button>
          <form action={deleteProduct}>
            <input type="hidden" name="productId" value={params.productId} />
            <SubmitButton variant="destructive">Delete Product</SubmitButton>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
