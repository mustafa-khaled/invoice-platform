"use server";

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "./utils/hooks";
import { onboardingSchema } from "./utils/zoe-schemas";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function onboardUser(formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { firstName, lastName, address } = submission.value;

  const data = await prisma.user.update({
    where: { id: session?.user?.id },
    data: {
      firstName,
      lastName,
      address,
    },
  });

  return redirect("/dashboard");
}
