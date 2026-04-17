import { useStore } from "@/lib/store";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { StatCard } from "@/components/StatCard";
import { Building2, Tags, Layers, TableProperties, Clock } from "lucide-react";

export default function DashboardPage() {
  const { partners, brands, subBrands, tables, activities } = useStore();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Breadcrumbs items={[{ label: "Dashboard" }]} />
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Partners" value={partners.length} icon={Building2} />
        <StatCard title="Total Brands" value={brands.length} icon={Tags} />
        <StatCard title="Total Sub Brands" value={subBrands.length} icon={Layers} />
        <StatCard title="Tables Configured" value={tables.length} icon={TableProperties} />
      </div>

      <div className="bg-card rounded-lg border shadow-card">
        <div className="p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Recent Activity
          </h2>
        </div>
        <div className="divide-y">
          {activities.slice(0, 10).map((a) => (
            <div key={a.id} className="px-4 py-3 flex items-center justify-between text-sm">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                  a.action === "Created" ? "bg-primary/10 text-primary" :
                  a.action === "Updated" ? "bg-secondary text-secondary-foreground" :
                  "bg-destructive/10 text-destructive"
                }`}>{a.action}</span>
                <span className="text-muted-foreground">{a.entity}:</span>{" "}
                <span className="font-medium">{a.entityName}</span>
              </div>
              <span className="text-muted-foreground text-xs shrink-0 ml-4">{formatDate(a.timestamp)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
