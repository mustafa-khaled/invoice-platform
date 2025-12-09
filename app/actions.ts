"use server";

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "./utils/hooks";
import { invoiceSchema, onboardingSchema } from "./utils/zod-schemas";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  mailClient,
  mailtrapRecipients,
  mailtrapSender,
} from "./utils/mailtrap";
import { formatDate } from "./utils/format-date";

export async function onboardUser(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const { firstName, lastName, address } = submission.value;

  await prisma.user.update({
    where: { id: session?.user?.id },
    data: {
      firstName,
      lastName,
      address,
    },
  });

  return redirect("/dashboard");
}
