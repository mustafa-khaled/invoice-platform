import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../utils/auth";

export default function LoginPage() {
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
            action={async () => {
              "use server";
              await signIn();
            }}
            className="space-y-2"
          >
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="john@mail.com" />
            </div>

            <Button className="w-full">Submit</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
