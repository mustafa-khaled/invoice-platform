"use server";

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "../utils/hooks";
import { productSchema } from "../utils/zod-schemas";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createProduct(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { name, price, description } = submission.value;

  await prisma.product.create({
    data: {
      name,
      price,
      description,
      userId: session.user?.id as string,
    },
  });

  return redirect("/dashboard/products");
}

export async function editProduct(prevState: unknown, formData: FormData) {
  const session = await requireUser();
  const productId = formData.get("productId") as string;

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { name, price, description } = submission.value;

  await prisma.product.update({
    where: {
      id: productId,
      userId: session.user?.id as string,
    },
    data: {
      name,
      price,
      description,
    },
  });

  return redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  const session = await requireUser();
  const productId = formData.get("productId") as string;

  await prisma.product.delete({
    where: {
      id: productId,
      userId: session.user?.id as string,
    },
  });

  return redirect("/dashboard/products");
}
