import { useState, useEffect } from "react";
import {
  AlertCircle,
  Building2,
  FileClock,
  PlayCircle,
  PlusCircle,
  Rocket,
} from "lucide-react";
import { BrandName } from "./BrandName";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  isStationTypeFilterValue,
  STATION_TYPE_FILTER_OPTIONS,
  STATION_TYPE_QUERY_KEY,
  type StationTypeFilterValue,
} from "../constants/stationTypeFilter";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

type ActivityScope = 'mine' | 'all';

interface ActivityRecord {
  id: string;
  actor_name?: string | null;
  action?: string;
  entity_type?: string;
  summary?: string;
  created_at?: string;
}

export function Dashboard() {
  const { token, user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const stationTypeParam = searchParams.get(STATION_TYPE_QUERY_KEY);
  const stationType = isStationTypeFilterValue(stationTypeParam) ? stationTypeParam : '';
  const [dashStats, setDashStats] = useState<any>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [activityScope, setActivityScope] = useState<ActivityScope>('mine');
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    const fetchStats = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        for (let attempt = 0; attempt < 2; attempt += 1) {
          const params = new URLSearchParams();
          if (stationType) {
            params.set(STATION_TYPE_QUERY_KEY, stationType);
          }
          const response = await fetch(`${API_URL}/dashboard/stats${params.toString() ? `?${params.toString()}` : ''}`, {
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
  }, [token, stationType]);

  const canViewAllActivity = user?.role === 'super_admin';

  useEffect(() => {
    if (!token) return;

    const effectiveScope: ActivityScope = canViewAllActivity ? activityScope : 'mine';

    const fetchActivities = async () => {
      setActivitiesLoading(true);
      try {
        const response = await fetch(`${API_URL}/dashboard/activities?scope=${effectiveScope}&limit=20`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }

        const data = await response.json();
        setActivities(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error('Failed to fetch dashboard activities:', err);
        setActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [token, activityScope, canViewAllActivity]);

  const s = dashStats?.stations || {};
  const projects = dashStats?.projects || {};
  const workflow = dashStats?.workflow || {};
  const recentActivities = activities;
  const stationsList: any[] = dashStats?.stationsList || [];
  const stationCards = [
    {
      title: "Total Stations",
      value: isLoading ? "..." : (s.total ?? 0),
      icon: <Building2 className="w-5 h-5" />,
      tone: "from-primary to-primary/70",
      bucket: "total-stations",
    },
    {
      title: "Under Execution",
      value: isLoading ? "..." : (s.under_execution ?? 0),
      icon: <FileClock className="w-5 h-5" />,
      tone: "from-info to-info/70",
      bucket: "under-execution",
    },
    {
      title: "Not Started",
      value: isLoading ? "..." : (s.not_started ?? 0),
      icon: <AlertCircle className="w-5 h-5" />,
      tone: "from-error to-error/70",
      bucket: "not-started",
    },
    {
      title: "Operational Stations",
      value: isLoading ? "..." : (s.operational ?? 0),
      icon: <PlayCircle className="w-5 h-5" />,
      tone: "from-success to-success/70",
      bucket: "operational-stations",
    },
    {
      title: "Opening Soon",
      value: isLoading ? "..." : (s.opening_soon ?? 0),
      icon: <Rocket className="w-5 h-5" />,
      tone: "from-warning to-warning/70",
      bucket: "opening-soon",
    },
    {
      title: "New Stations",
      value: isLoading ? "..." : (s.new_this_month ?? 0),
      icon: <PlusCircle className="w-5 h-5" />,
      tone: "from-secondary to-secondary/70",
      bucket: "new-stations",
    },
  ];

  const projectCards = [
    {
      title: "Total Projects",
      value: isLoading ? "..." : (workflow.total_projects ?? projects.total ?? 0),
      color: "bg-primary/10 text-primary",
      bucket: "total-projects",
    },
    {
      title: "Pending",
      value: isLoading ? "..." : (projects.pending_review || 0),
      color: "bg-warning/10 text-warning",
      bucket: "pending-review",
    },
    {
      title: "Validated",
      value: isLoading ? "..." : (projects.validated || 0),
      color: "bg-info/10 text-info",
      bucket: "validated",
    },
    {
      title: "Approved",
      value: isLoading ? "..." : (projects.approved || 0),
      color: "bg-success/10 text-success",
      bucket: "approved",
    },
    {
      title: "Contracted",
      value: isLoading ? "..." : (workflow.contracted || 0),
      color: "bg-primary/10 text-primary",
      bucket: "contracted",
    },
    {
      title: "Document",
      value: isLoading ? "..." : (workflow.documented || 0),
      color: "bg-secondary/10 text-secondary",
      bucket: "documented",
    },
    {
      title: "Rejected",
      value: isLoading ? "..." : (projects.rejected ?? workflow.rejected ?? 0),
      color: "bg-error/10 text-error",
      bucket: "rejected",
    },
  ];

  const stations: any[] = stationsList;
  const handleStationTypeChange = (value: StationTypeFilterValue) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(STATION_TYPE_QUERY_KEY, value);
    } else {
      nextParams.delete(STATION_TYPE_QUERY_KEY);
    }
    setSearchParams(nextParams);
  };

  const buildStationsLink = (bucket: string) => {
    const params = new URLSearchParams({ bucket });
    if (stationType) {
      params.set(STATION_TYPE_QUERY_KEY, stationType);
    }
    return `/all-stations-list?${params.toString()}`;
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground"><BrandName /> Project Management & Tracking System</p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <label htmlFor="dashboard-station-type" className="text-sm font-semibold text-muted-foreground">
            Station Type
          </label>
          <select
            id="dashboard-station-type"
            value={stationType}
            onChange={(event) => handleStationTypeChange(event.target.value as StationTypeFilterValue)}
            className="min-w-[180px] rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground shadow-sm"
            aria-label="Filter dashboard by station type"
          >
            {STATION_TYPE_FILTER_OPTIONS.map((option) => (
              <option key={option.value || 'all'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loadError && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">
          {loadError}
        </div>
      )}

      {/* Stations Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 mb-6">
        {stationCards.map((stat) => (
          <Link
            key={stat.title}
            to={buildStationsLink(stat.bucket)}
            className="bg-card rounded-xl shadow-md p-5 card-glow transition-all block group relative overflow-hidden border border-border"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className={`text-white p-2.5 rounded-xl bg-gradient-to-br ${stat.tone} shadow-lg`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-muted-foreground text-sm font-semibold mb-1">{stat.title}</h3>
            <p className="text-4xl leading-none font-black text-foreground">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Projects Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-3 mb-8">
        {projectCards.map((stat) => (
          <Link
            key={stat.title}
            to={buildStationsLink(stat.bucket)}
            className="rounded-xl shadow-md px-4 py-4 card-glow transition-all block group relative overflow-hidden border border-border bg-card"
          >
            <div className={`absolute inset-0 opacity-60 ${stat.color}`}></div>
            <div className="relative">
              <h3 className="text-[11px] uppercase tracking-wide text-muted-foreground font-bold mb-2">{stat.title}</h3>
              <p className="text-4xl leading-none font-black text-foreground">{stat.value}</p>
            </div>
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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Activities</h2>
          <div className="flex items-center gap-2">
            {canViewAllActivity && (
              <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-muted/30">
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activityScope === 'mine' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setActivityScope('mine')}
                >
                  My Activity
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${activityScope === 'all' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setActivityScope('all')}
                >
                  All Users
                </button>
              </div>
            )}
            <Link to="/all-stations-activity-history" className="text-sm font-semibold text-primary hover:underline">
              History
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          {activitiesLoading ? (
            <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
              Loading recent activities...
            </div>
          ) : recentActivities.length === 0 ? (
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
                  <p className="font-medium text-foreground">{activity.summary || activity.action || 'Activity recorded'}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {activity.entity_type?.replace(/_/g, ' ') || 'general'}
                    {activity.actor_name ? ` | ${activity.actor_name}` : ''}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {activity.created_at ? new Date(activity.created_at).toLocaleString() : ''}
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






