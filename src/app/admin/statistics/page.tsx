import AnalyticsCards from "@/components/admin/AnalyticsCards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminStatisticsPage() {
  return (
    <div className="p-8">
      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalyticsCards />
        </CardContent>
      </Card>
    </div>
  );
}
