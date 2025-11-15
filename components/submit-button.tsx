"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button className={cn(className)} type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="size-4 mrl-2 animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
