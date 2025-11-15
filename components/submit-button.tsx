"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

interface SubmitButtonProps {
  children?: React.ReactNode;
  className?: string;
}

export default function SubmitButton({
  children,
  className,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn("w-full", className)}
      type="submit"
      disabled={pending}
    >
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
