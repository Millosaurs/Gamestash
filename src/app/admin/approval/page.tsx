import ApprovalTable from "@/components/admin/ApprovalTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminApprovalPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Product Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovalTable />
        </CardContent>
      </Card>
    </div>
  );
}
