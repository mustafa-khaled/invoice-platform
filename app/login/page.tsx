import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth, signIn } from "../utils/auth";
import SubmitButton from "@/components/submit-button";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter Your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              await signIn("nodemailer", formData);
            }}
            className="space-y-2"
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                placeholder="john@mail.com"
                name="email"
                type="email"
                required
              />
            </div>

            <SubmitButton className="w-full">Submit</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
