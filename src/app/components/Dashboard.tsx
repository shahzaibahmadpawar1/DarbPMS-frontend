import { useState, useEffect } from "react";
import { CheckCircle, ClipboardList, Clock, FileText, PlusCircle, AlertCircle } from "lucide-react";
import { BrandName } from "./BrandName";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function Dashboard() {
  const { token } = useAuth();
  const [dashStats, setDashStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        for (let attempt = 0; attempt < 2; attempt += 1) {
          const response = await fetch(`${API_URL}/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          if (response.ok) {
            const data = await response.json();
            setDashStats(data);
            return;
          }

          if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 250));
          }
        }
        setLoadError('Dashboard data is temporarily unavailable.');
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setLoadError('Dashboard data is temporarily unavailable.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const s = dashStats?.stations || {};
  const projects = dashStats?.projects || {};
  const workflow = dashStats?.workflow || {};
  const recentActivities: any[] = dashStats?.recentActivities || [];
  const stationsList: any[] = dashStats?.stationsList || [];
  const projectCards = [
    {
      title: "Total Projects",
      value: isLoading ? "..." : (workflow.total_projects ?? projects.total ?? 0),
      icon: <CheckCircle className="w-8 h-8" />,
      color: "bg-primary",
      bucket: 'total-projects',
    },
    {
      title: "Pending Review",
      value: isLoading ? "..." : (projects.pending_review || 0),
      icon: <Clock className="w-8 h-8" />,
      color: "bg-info",
      bucket: 'pending-review',
    },
    {
      title: "Validated",
      value: isLoading ? "..." : (projects.validated || 0),
      icon: <AlertCircle className="w-8 h-8" />,
      color: "bg-error",
      bucket: 'validated',
    },
    {
      title: "Approved",
      value: isLoading ? "..." : (projects.approved || 0),
      icon: <CheckCircle className="w-8 h-8" />,
      color: "bg-success",
      bucket: 'approved',
    },
    {
      title: "New Projects",
      value: isLoading ? "..." : (workflow.new_project ?? projects.pending_review ?? 0),
      icon: <PlusCircle className="w-8 h-8" />,
      color: "bg-primary",
      bucket: 'new-projects',
    },
    {
      title: "Contracted",
      value: isLoading ? "..." : (workflow.contracted || 0),
      icon: <FileText className="w-8 h-8" />,
      color: "bg-primary",
      bucket: 'contracted',
    },
    {
      title: "Documented",
      value: isLoading ? "..." : (workflow.documented || 0),
      icon: <ClipboardList className="w-8 h-8" />,
      color: "bg-primary",
      bucket: 'documented',
    },
  ];

  const stations: any[] = stationsList;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground"><BrandName /> Project Management & Tracking System</p>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">
          {loadError}
        </div>
      )}

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4 mb-8">
        {projectCards.map((stat) => (
          <Link
            key={stat.title}
            to={`/all-stations-list?bucket=${stat.bucket}`}
            className="bg-card rounded-xl shadow-md p-6 card-glow transition-all block group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-white p-3 rounded-xl shadow-lg shadow-primary/20`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Total Stations Progress Widget */}
      <div className="bg-card rounded-xl shadow-xl p-8 mb-8 card-glow relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Total Stations Progress</h2>
          <Link to="/total-stations" className="text-primary text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="space-y-6">
          {stations.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
              {isLoading ? "Loading station data..." : "No station progress data found."}
            </div>
          ) : (
            stations.map((station, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{station.station_name || station.name}</p>
                    <span className="text-xs text-muted-foreground capitalize">{station.station_status_code || station.status || 'Active'}</span>
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {station.created_at ? new Date(station.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-full opacity-30" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-card rounded-xl shadow-xl p-8 mb-12 card-glow relative overflow-hidden">
        <h2 className="text-xl font-bold text-foreground mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
              No recent activities recorded.
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all bg-card/50 backdrop-blur-sm"
              >
                <div>
                  <p className="font-medium text-foreground">{activity.project_name || activity.action}</p>
                  <p className="text-sm text-muted-foreground capitalize">{activity.review_status || activity.station} | {activity.department_type}</p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.created_at ? new Date(activity.created_at).toLocaleDateString() : activity.time}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Executive Analytics Section */}
      {/*<div className="mt-8 border-t border-border pt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 px-4">Executive Analytics</h2>
        <ExecutiveDashboard />
      </div>*/}
    </div>
  );
}






