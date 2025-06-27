import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProductTable from "@/components/admin/ProductTable";

export default function AdminProductsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductTable />
        </CardContent>
      </Card>
    </div>
  );
}
