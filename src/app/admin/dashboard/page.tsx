import AnalyticsCards from "@/components/admin/AnalyticsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="p-8 w-full">
      <AnalyticsCards />
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome to the Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Use the sidebar to manage users, products, approvals, and view
            statistics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
