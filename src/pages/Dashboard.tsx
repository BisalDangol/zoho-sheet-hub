import { Store, Users, FileSpreadsheet, TrendingUp } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { VendorOverview } from "@/components/dashboard/VendorOverview";
import { SheetChart } from "@/components/dashboard/SheetChart";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user, role } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here's what's happening with your vendors today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Vendors"
            value="128"
            change="+12% from last month"
            changeType="positive"
            icon={Store}
            iconColor="text-primary"
            delay={100}
          />
          <StatsCard
            title="Active Users"
            value="45"
            change="+5 new this week"
            changeType="positive"
            icon={Users}
            iconColor="text-accent"
            delay={150}
          />
          <StatsCard
            title="Data Sheets"
            value="24"
            change="2 pending sync"
            changeType="neutral"
            icon={FileSpreadsheet}
            iconColor="text-warning"
            delay={200}
          />
          <StatsCard
            title="Performance"
            value="94%"
            change="+2.3% improvement"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-success"
            delay={250}
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <VendorOverview />
          <RecentActivity />
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SheetChart
            sheetId="19NrXMTwx48I_KJbazkgorBRHWwgBfPnMoAIVNxSkM9U"
            range="Sheet1!A1:B10"
            title="Sample Chart from Google Sheets"
            dataKey="value"
            labelKey="label"
          />
          <SheetChart
            sheetId="19NrXMTwx48I_KJbazkgorBRHWwgBfPnMoAIVNxSkM9U"
            range="Sheet1!C1:D10"
            title="Another Chart"
            dataKey="amount"
            labelKey="category"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
