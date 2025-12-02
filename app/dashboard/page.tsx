import DashboardBlocks from "@/components/dashboard-blocks";
import InvoiceChart from "@/components/invoice-chart";
import RecentInvoices from "@/components/recent-invoices";

export default async function DashboardPage() {
  return (
    <>
      <DashboardBlocks />
      <div className="grid gap-4 md:gap-4 lg:grid-cols-3">
        <InvoiceChart />
        <RecentInvoices />
      </div>
    </>
  );
}
