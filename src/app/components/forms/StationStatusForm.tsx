import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStation } from "../../context/StationContext";

export function StationStatusForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';
  const navigate = useNavigate();

  const statuses = [
    { code: "1", description: "Active" },
    { code: "2", description: "Inactive" },
    { code: "3", description: "Under Construction" },
    { code: "4", description: "Under Development" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Station Status (Master Data)</h1>
          <p className="text-muted-foreground mt-2">Manage station status classifications</p>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      <div className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status Code (PK)</th>
              <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Description</th>
            </tr>
          </thead>
          <tbody>
            {statuses.map((status) => (
              <tr
                key={status.code}
                onClick={() => navigate("/total-stations")}
                className="border-b border-border/50 hover:bg-muted cursor-pointer transition-colors text-foreground"
                title={`View all ${status.description} stations`}
              >
                <td className="py-3 px-4">{status.code}</td>
                <td className="py-3 px-4">{status.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}







