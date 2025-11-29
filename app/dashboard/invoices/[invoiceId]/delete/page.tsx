import { requireUser } from "@/app/utils/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { redirect } from "next/navigation";
import warningGif from "@/public/warning.gif";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import { deleteInvoice } from "@/app/actions";

async function Authorize(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId, userId: userId },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }

  return data;
}

export default async function DeleteInvoiceRoute({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;
  const session = await requireUser();

  await Authorize(invoiceId, session?.user?.id as string);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="w-full max-w-[500px]">
        <CardHeader>
          <CardTitle>Delete Invoice</CardTitle>
          <CardDescription>
            Are you sure that you want to delete this invoice?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={warningGif} alt="Warning GIF" className="rounded-lg" />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Link
            href="/dashboard/invoices"
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>

          <form
            action={async () => {
              "use server";
              await deleteInvoice(invoiceId);
            }}
          >
            <SubmitButton variant="destructive">Delete Invoice</SubmitButton>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
