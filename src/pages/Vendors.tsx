import { Plus, Search, MoreHorizontal, Store } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const vendors = [
  { id: 1, name: "TechSupply Co.", email: "contact@techsupply.com", category: "Electronics", status: "active", products: 145 },
  { id: 2, name: "Global Goods Ltd.", email: "info@globalgoods.com", category: "General", status: "active", products: 89 },
  { id: 3, name: "Premium Parts Inc.", email: "sales@premiumparts.com", category: "Industrial", status: "pending", products: 234 },
  { id: 4, name: "Swift Supplies", email: "hello@swiftsupplies.com", category: "Logistics", status: "active", products: 67 },
  { id: 5, name: "Eco Essentials", email: "support@ecoessentials.com", category: "Sustainable", status: "active", products: 112 },
];

export default function Vendors() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendors</h1>
            <p className="mt-1 text-muted-foreground">Manage your vendor relationships</p>
          </div>
          <Button className="w-fit">
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search vendors..." className="pl-10" />
          </div>
        </div>

        {/* Table */}
        <Card className="border-border/50 shadow-soft animate-fade-in" style={{ animationDelay: "200ms" }}>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">All Vendors</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor, index) => (
                  <TableRow 
                    key={vendor.id}
                    className="animate-slide-in"
                    style={{ animationDelay: `${300 + index * 50}ms` }}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <Store className="h-5 w-5 text-secondary-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{vendor.name}</p>
                          <p className="text-sm text-muted-foreground">{vendor.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{vendor.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">{vendor.products}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={vendor.status === "active" ? "default" : "secondary"}
                        className={vendor.status === "active" ? "bg-success/10 text-success hover:bg-success/20" : ""}
                      >
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
