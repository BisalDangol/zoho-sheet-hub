import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const vendors = [
  {
    id: 1,
    name: "TechSupply Co.",
    category: "Electronics",
    status: "active",
    performance: 92,
  },
  {
    id: 2,
    name: "Global Goods Ltd.",
    category: "General",
    status: "active",
    performance: 87,
  },
  {
    id: 3,
    name: "Premium Parts Inc.",
    category: "Industrial",
    status: "pending",
    performance: 75,
  },
  {
    id: 4,
    name: "Swift Supplies",
    category: "Logistics",
    status: "active",
    performance: 94,
  },
];

export function VendorOverview() {
  return (
    <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: "300ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Top Vendors</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {vendors.map((vendor, index) => (
          <div 
            key={vendor.id} 
            className="space-y-2 animate-slide-in"
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-semibold text-secondary-foreground">
                  {vendor.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">{vendor.category}</p>
                </div>
              </div>
              <Badge 
                variant={vendor.status === "active" ? "default" : "secondary"}
                className={vendor.status === "active" ? "bg-success/10 text-success hover:bg-success/20" : ""}
              >
                {vendor.status}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={vendor.performance} className="h-2 flex-1" />
              <span className="text-sm font-medium text-foreground w-10">{vendor.performance}%</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
