import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, XCircle, Activity } from "lucide-react";
import logo from "../../assets/logo.png";
import { stationSections } from "../data/formSections";
import { useStation } from "../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function StationFormsPage() {
  const { stationId } = useParams();
  const { setSelectedStation } = useStation();
  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState<any | null>(null);

  useEffect(() => {
    const fetchStation = async () => {
      if (!stationId) return;
      const token = localStorage.getItem("auth_token");

      try {
        const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          setStation(null);
          return;
        }

        const result = await response.json();
        const s = result?.data;

        if (!s) {
          setStation(null);
          return;
        }

        const mapped = {
          id: s.id,
          station_code: s.station_code,
          name: s.station_name,
          region: s.area_region || "N/A",
          city: s.city || "N/A",
          project: s.district || "N/A",
          customerName: s.street || "N/A",
          status: s.station_status_code || "Active",
          formsCompleted: stationSections.reduce((sum, section) => sum + section.items.filter((item) => item.completed).length, 0),
          totalForms: stationSections.reduce((sum, section) => sum + section.items.length, 0),
        };

        setStation(mapped);
        setSelectedStation({
          id: mapped.id,
          station_code: mapped.station_code,
          name: mapped.name,
          region: mapped.region,
          city: mapped.city,
          project: mapped.project,
        });
      } catch {
        setStation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [stationId, setSelectedStation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!station) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
        Station not found.
      </div>
    );
  }

  const completionPercentage = Math.round((station.formsCompleted / station.totalForms) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5 flex-shrink-0">
              <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="text-2xl font-black text-foreground">{station.name}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-bold border bg-success/10 text-success border-success/20">
                  {station.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{station.region} • {station.city} • {station.customerName}</p>
              <p className="text-xs text-muted-foreground mt-1">Code: {station.station_code}</p>
            </div>
          </div>

          <Link
            to={`/station/${station.id}/analytics`}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold text-sm"
          >
            <Activity className="w-4 h-4" /> Analytics
          </Link>
        </div>

        <div className="mt-5 max-w-md">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-muted-foreground">Form Completion</span>
            <span className="text-xs font-bold text-primary">{station.formsCompleted}/{station.totalForms} ({completionPercentage}%)</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stationSections.map((section) => (
            <div key={section.group} className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{section.group}</h4>
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  to={`/station/${station.id}/form/${item.path}`}
                  className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border group ${item.completed
                    ? "bg-success/5 text-success border-success/20 hover:bg-success/10 hover:border-success/30"
                    : "bg-error/5 text-error border-error/20 hover:bg-error/10 hover:border-error/30"}`}
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {item.completed ? (
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-error flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
