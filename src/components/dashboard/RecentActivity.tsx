import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const activities = [
  {
    id: 1,
    user: "John Doe",
    action: "Added new vendor",
    target: "TechSupply Co.",
    time: "2 min ago",
    type: "create",
  },
  {
    id: 2,
    user: "Sarah Smith",
    action: "Updated data sheet",
    target: "Q4 Inventory",
    time: "15 min ago",
    type: "update",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Exported report",
    target: "Monthly Sales",
    time: "1 hour ago",
    type: "export",
  },
  {
    id: 4,
    user: "Emily Brown",
    action: "Deleted vendor",
    target: "Old Supplies Inc.",
    time: "3 hours ago",
    type: "delete",
  },
  {
    id: 5,
    user: "David Wilson",
    action: "Added new user",
    target: "alex@company.com",
    time: "5 hours ago",
    type: "create",
  },
];

const typeColors = {
  create: "bg-success/10 text-success",
  update: "bg-primary/10 text-primary",
  export: "bg-accent/10 text-accent",
  delete: "bg-destructive/10 text-destructive",
};

export function RecentActivity() {
  return (
    <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: "400ms" }}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={activity.id} 
            className="flex items-center gap-4 animate-slide-in"
            style={{ animationDelay: `${500 + index * 100}ms` }}
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                {activity.user.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.user}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {activity.action}: <span className="font-medium">{activity.target}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="secondary" className={typeColors[activity.type as keyof typeof typeColors]}>
                {activity.type}
              </Badge>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
