import SubmitButton from "@/components/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { onboardUser } from "../actions";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="md:w-[400px] w-[90%]">
        <CardHeader>
          <CardTitle>You are almost finished</CardTitle>
          <CardDescription>
            Enter you information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              // await onboardUser(formData);
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 grid-cols-2 [&>div]:flex [&>div]:flex-col [&>div]:gap-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" placeholder="John" />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" placeholder="Doe" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Giza, Pyramids st."
              />
            </div>
            <SubmitButton>Finish Onboarding</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
