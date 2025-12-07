import { Info } from "lucide-react";

export default function NoDataFound({
  message = "No Data Found",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 font-medium">
      <Info />
      {message}
    </div>
  );
}
