"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";

interface SubmitButtonProps extends VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
}

export default function SubmitButton({
  children,
  className,
  variant,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      className={cn("w-full", className)}
      type="submit"
      disabled={pending}
      variant={variant}
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
