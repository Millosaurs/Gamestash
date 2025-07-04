import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SalesTable from "@/components/admin/ProductSalesTable";

export default function AdminProductsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>View Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesTable />
        </CardContent>
      </Card>
    </div>
  );
}
