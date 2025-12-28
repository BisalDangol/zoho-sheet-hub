import { ArrowRight, Store, Shield, FileSpreadsheet, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow">
              <Store className="h-10 w-10 text-primary-foreground" />
            </div>
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground lg:text-6xl">
              VendorHub
            </h1>
            <p className="mb-8 text-xl text-muted-foreground">
              The complete multi-vendor management platform. Streamline operations, 
              sync with Google Sheets, and manage your team effortlessly.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link to="/auth">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Store, title: "Vendor Management", desc: "Track and manage all your vendors in one place" },
            { icon: FileSpreadsheet, title: "Google Sheets Sync", desc: "Automatic data sync with your spreadsheets" },
            { icon: Shield, title: "Role-Based Access", desc: "Admin and Super Admin role management" },
          ].map((feature, i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card p-8 shadow-soft animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
