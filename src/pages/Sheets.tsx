import { Plus, Search, ExternalLink, RefreshCw, FileSpreadsheet } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const sheets = [
  {
    id: 1,
    name: "Vendor Inventory",
    description: "Main inventory tracking sheet",
    lastSync: "2 min ago",
    status: "synced",
    records: 1245,
  },
  {
    id: 2,
    name: "Q4 Sales Report",
    description: "Quarterly sales data by vendor",
    lastSync: "15 min ago",
    status: "synced",
    records: 892,
  },
  {
    id: 3,
    name: "Vendor Contacts",
    description: "Contact information database",
    lastSync: "1 hour ago",
    status: "pending",
    records: 456,
  },
  {
    id: 4,
    name: "Product Catalog",
    description: "Complete product listings",
    lastSync: "3 hours ago",
    status: "synced",
    records: 3421,
  },
];

export default function Sheets() {
  const googleSheetUrl = "https://docs.google.com/spreadsheets/d/19NrXMTwx48I_KJbazkgorBRHWwgBfPnMoAIVNxSkM9U/edit?gid=875715555#gid=875715555";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Data Sheets</h1>
            <p className="mt-1 text-muted-foreground">Manage and sync your Google Sheets data</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <a href={googleSheetUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Master Sheet
              </a>
            </Button>
            <Button className="w-fit">
              <Plus className="mr-2 h-4 w-4" />
              Connect Sheet
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search sheets..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Sheets Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sheets.map((sheet, index) => (
            <Card 
              key={sheet.id} 
              className="border-border/50 shadow-soft hover:shadow-glow transition-shadow cursor-pointer animate-fade-in"
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                    <FileSpreadsheet className="h-6 w-6 text-primary" />
                  </div>
                  <Badge 
                    variant={sheet.status === "synced" ? "default" : "secondary"}
                    className={sheet.status === "synced" ? "bg-success/10 text-success hover:bg-success/20" : "bg-warning/10 text-warning"}
                  >
                    {sheet.status}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg">{sheet.name}</CardTitle>
                <CardDescription>{sheet.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {sheet.records.toLocaleString()} records
                  </span>
                  <span className="text-muted-foreground">
                    Synced {sheet.lastSync}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
