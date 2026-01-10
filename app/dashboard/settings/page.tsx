import { requireUser } from "@/app/utils/hooks";
import prisma from "@/lib/prisma";
import { SettingsForm } from "./settings-form";

async function getData(userId: string) {
  const data = await prisma.settings.findUnique({
    where: {
      userId: userId,
    },
  });

  return data;
}

export default async function SettingsPage() {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <div className="grid items-start gap-8">
      <div className="flex items-center justify-between px-2">
        <div className="grid gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your global styles and configuration
          </p>
        </div>
      </div>

      <SettingsForm initialData={data} />
    </div>
  );
}
