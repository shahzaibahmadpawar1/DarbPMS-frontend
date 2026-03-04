import { useState, useEffect } from "react";
import { Clock, AlertCircle, CheckCircle, Calendar, ChevronDown, PlusCircle } from "lucide-react";
import { BrandName } from "./BrandName";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export function Dashboard() {
  const { token } = useAuth();
  const [stationType, setStationType] = useState<string>("All");
  const [dashStats, setDashStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setDashStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const s = dashStats?.stations || {};
  const projects = dashStats?.projects || {};
  const recentActivities: any[] = dashStats?.recentActivities || [];
  const stationsList: any[] = dashStats?.stationsList || [];

  const stats = [
    {
      title: "Total Stations",
      value: isLoading ? "..." : (s.total || "0"),
      icon: <img src={logo} alt="" className="w-8 h-8 object-contain brightness-0 invert" />,
      change: `${projects.approved || 0} approved`,
      color: "bg-gradient-to-br from-primary to-secondary",
      path: "/total-stations",
    },
    {
      title: "Under Execution",
      value: isLoading ? "..." : (s.under_execution || "0"),
      icon: <Clock className="w-8 h-8" />,
      change: `${projects.pending_review || 0} pending`,
      color: "bg-info",
      path: "/all-stations-under-review",
    },
    {
      title: "Not Started",
      value: isLoading ? "..." : (s.not_started || "0"),
      icon: <AlertCircle className="w-8 h-8" />,
      change: `${projects.validated || 0} validated`,
      color: "bg-error",
      path: "/all-stations-under-review",
    },
    {
      title: "Operational Stations",
      value: isLoading ? "..." : (s.operational || "0"),
      icon: <CheckCircle className="w-8 h-8" />,
      change: `${projects.total || 0} projects`,
      color: "bg-success",
      path: "/total-stations",
    },
    {
      title: "Opening Soon",
      value: isLoading ? "..." : (s.opening_soon || "0"),
      icon: <Calendar className="w-8 h-8" />,
      change: "",
      color: "bg-gradient-to-br from-primary to-secondary",
      path: "/total-stations",
    },
    {
      title: "New stations during the month",
      value: isLoading ? "..." : (s.new_this_month || "0"),
      icon: <PlusCircle className="w-8 h-8" />,
      change: "",
      color: "bg-primary",
      path: "/total-stations",
    },
  ];

  const stations: any[] = stationsList;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Dashboard</h1>
          <p className="text-gray-600"><BrandName /> Project Management & Tracking System</p>
        </div>

        {/* Station Type Filter */}
        <div className="relative">
          <label className="block text-sm font-medium text-muted-foreground mb-2">Station Type</label>
          <div className="relative">
            <select
              value={stationType}
              onChange={(e) => setStationType(e.target.value)}
              className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer hover:border-primary/50 transition-colors min-w-[160px]"
            >
              <option value="All">All</option>
              <option value="Operation">Operation</option>
              <option value="Rent">Rent</option>
              <option value="Franchise">Franchise</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            to={stat.path}
            className="bg-card rounded-xl shadow-md p-6 card-glow transition-all block group relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} text-white p-3 rounded-xl shadow-lg shadow-primary/20`}>
                {stat.icon}
              </div>
              {stat.change && (
                <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Projects Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Projects', value: projects.total || 0, color: 'bg-blue-50 text-blue-700 border-blue-100' },
          { label: 'Pending Review', value: projects.pending_review || 0, color: 'bg-amber-50 text-amber-700 border-amber-100' },
          { label: 'Validated', value: projects.validated || 0, color: 'bg-purple-50 text-purple-700 border-purple-100' },
          { label: 'Approved', value: projects.approved || 0, color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
        ].map(item => (
          <Link key={item.label} to="/all-stations-under-review"
            className={`bg-card rounded-xl border p-4 flex flex-col gap-1 hover:shadow-md transition-all ${item.color}`}>
            <p className="text-xs font-bold uppercase tracking-wide opacity-70">{item.label}</p>
            <p className="text-3xl font-black">{isLoading ? '...' : item.value}</p>
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
                  <p className="text-sm text-muted-foreground capitalize">{activity.review_status || activity.station} • {activity.department_type}</p>
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





