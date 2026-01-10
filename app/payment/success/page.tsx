import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <div className="bg-green-500/10 p-6 rounded-full text-green-500 mb-6 animate-in zoom-in duration-300">
        <CheckCircle2 className="size-16" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Thank you for your payment. A receipt has been sent to your email
        address.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
