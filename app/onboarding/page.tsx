import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OnboardingForm from "./onboarding-form";

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
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}
