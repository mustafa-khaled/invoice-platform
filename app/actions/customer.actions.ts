"use server";

import { parseWithZod } from "@conform-to/zod";
import { customerSchema } from "../utils/customer.schema";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireUser } from "../utils/hooks";

export async function createCustomer(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: customerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { name, email, address, phone } = submission.value;

  if (!session.user?.id) {
    throw new Error("User ID is missing from session");
  }

  const userId: string = session.user.id;

  await prisma.customer.create({
    data: {
      name,
      email,
      address,
      phone,
      userId,
    },
  });

  return redirect("/dashboard/customers");
}
