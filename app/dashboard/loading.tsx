import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
              <Skeleton className="size-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:gap-8 lg:grid-cols-3 mt-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-6 w-[150px]" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center gap-4 mb-4 last:mb-0"
              >
                <Skeleton className="hidden sm:flex size-9 rounded-full" />
                <div className="grid gap-1">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
                <div className="ml-auto flex flex-col items-end gap-1">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-3 w-[40px]" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
