import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";
import Link from "next/link";

interface NoDataFoundProps {
  title?: string;
  description?: string;
  message?: string;
  href?: string;
  buttonText?: string;
}

export default function NoDataFound({
  title = "No Data Found",
  description = "There is no data to display currently.",
  message,
  href,
  buttonText,
}: NoDataFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <FileQuestion className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-foreground">
        {message || title}
      </h2>
      <p className="mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
        {description}
      </p>
      {href && buttonText && (
        <div className="mt-6">
          <Button asChild>
            <Link href={href}>{buttonText}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
