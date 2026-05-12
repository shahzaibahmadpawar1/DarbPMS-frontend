import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

type ActivityScope = "mine" | "all";

interface ActivityRecord {
  id: string;
  actor_name?: string | null;
  action?: string;
  entity_type?: string;
  summary?: string;
  created_at?: string;
}

export function RecentActivitiesPage() {
  const { token, user } = useAuth();
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [activityScope, setActivityScope] = useState<ActivityScope>("mine");
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const canViewAllActivity = user?.role === "super_admin" || user?.role === "ceo";

  useEffect(() => {
    if (!token) return;

    const effectiveScope: ActivityScope = canViewAllActivity ? activityScope : "mine";

    const fetchActivities = async () => {
      setActivitiesLoading(true);
      try {
        const response = await fetch(
          `${API_URL}/dashboard/activities?scope=${effectiveScope}&limit=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch activities");
        }

        const data = await response.json();
        setActivities(Array.isArray(data?.data) ? data.data : []);
      } catch (err) {
        console.error("Failed to fetch dashboard activities:", err);
        setActivities([]);
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [token, activityScope, canViewAllActivity]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="bg-card rounded-xl shadow-xl p-6 sm:p-8 card-glow relative overflow-hidden border border-border">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold text-foreground">Recent Activities</h1>
          <div className="flex items-center gap-2">
            {canViewAllActivity && (
              <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-muted/30">
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activityScope === "mine"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActivityScope("mine")}
                >
                  My Activity
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    activityScope === "all"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActivityScope("all")}
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
          ) : activities.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
              No recent activities recorded.
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all bg-card/50 backdrop-blur-sm gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {activity.summary || activity.action || "Activity recorded"}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {activity.entity_type?.replace(/_/g, " ") || "general"}
                    {activity.actor_name ? ` | ${activity.actor_name}` : ""}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                  {activity.created_at ? new Date(activity.created_at).toLocaleString() : ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
