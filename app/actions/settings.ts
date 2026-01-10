"use server";

import { parseWithZod } from "@conform-to/zod";
import { requireUser } from "../utils/hooks";
import { settingsSchema } from "../utils/zod-schemas";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function upsertSettings(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: settingsSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await prisma.settings.upsert({
    where: {
      userId: session.user?.id,
    },
    update: {
      currency: submission.value.currency,
      taxName: submission.value.taxName,
      taxRate: submission.value.taxRate,
      brandColor: submission.value.brandColor,
    },
    create: {
      userId: session.user?.id as string,
      currency: submission.value.currency,
      taxName: submission.value.taxName,
      taxRate: submission.value.taxRate,
      brandColor: submission.value.brandColor,
    },
  });

  return redirect("/dashboard/settings");
}
