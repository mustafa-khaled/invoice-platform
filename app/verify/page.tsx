import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <Card className="w-[380px] px-5">
        <CardHeader className="text-center ">
          <div className="mx-auto mb-4 flex items-center justify-center size-20 bg-blue-100 rounded-full">
            <Mail className=" size-12 text-blue-500" />
          </div>

          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We have sent a verification link to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-4 border-yellow-300 py-4 px-2 rounded-md bg-yellow-50">
            <div className="flex items-center gap-2 w-full">
              <AlertCircle className="size-5 text-yellow-400" />
              <p className="text-sm font-medium text-yellow-800">
                Be sure to check your spam folder!
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link
            href="/"
            className={buttonVariants({
              className: "w-full",
              variant: "outline",
            })}
          >
            <ArrowLeft className="size-4 mr-2" /> Back to home page
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
