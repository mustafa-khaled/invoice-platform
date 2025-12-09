import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import paidGif from "@/public/paid.gif";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import SubmitButton from "@/components/submit-button";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { requireUser } from "@/app/utils/hooks";
import { markInvoiceAsPaid } from "@/app/actions/invoice.action";

async function Authorize(invoiceId: string, userId: string) {
  const data = await prisma.invoice.findUnique({
    where: { id: invoiceId, userId: userId },
  });

  if (!data) {
    return redirect("/dashboard/invoices");
  }

  return data;
}

export default async function MarkAsPaid({
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
          <CardTitle>Mark invoice as paid</CardTitle>
          <CardDescription>
            Are you sure that you want to mark this invoice as paid?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image src={paidGif} alt="Warning GIF" className="rounded-lg" />
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
              await markInvoiceAsPaid(invoiceId);
            }}
          >
            <SubmitButton>Mark as paid!!</SubmitButton>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
