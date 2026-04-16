import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

type ActivityScope = 'mine' | 'all';

interface ActivityRecord {
  id: string;
  actor_name?: string | null;
  action?: string;
  entity_type?: string;
  entity_id?: string | null;
  summary?: string;
  created_at?: string;
}

export function ActivityHistoryPage() {
  const { token, user } = useAuth();
  const canViewAllActivity = user?.role === 'super_admin' || user?.role === 'ceo';

  const [scope, setScope] = useState<ActivityScope>('mine');
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const pageSize = 50;

  const loadActivities = async (nextOffset: number, reset: boolean) => {
    if (!token) return;

    const effectiveScope: ActivityScope = canViewAllActivity ? scope : 'mine';
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/dashboard/activities?scope=${effectiveScope}&limit=${pageSize}&offset=${nextOffset}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch activity history');
      }

      const payload = await response.json();
      const rows: ActivityRecord[] = Array.isArray(payload?.data) ? payload.data : [];
      const total = Number(payload?.total || 0);
      let updatedLength = rows.length;
      setRecords((prev) => {
        const next = reset ? rows : [...prev, ...rows];
        updatedLength = next.length;
        return next;
      });
      setOffset(nextOffset + rows.length);
      setHasMore(updatedLength < total);
    } catch (error) {
      console.error('Failed to fetch activity history:', error);
      if (reset) {
        setRecords([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setOffset(0);
    setRecords([]);
    void loadActivities(0, true);
  }, [token, scope, canViewAllActivity]);

  return (
    <div className="p-8">
      <div className="bg-card rounded-xl shadow-xl p-8 card-glow relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">Activity History</h1>
            <p className="text-sm text-muted-foreground">Complete timeline of user actions with timestamps.</p>
          </div>
          {canViewAllActivity && (
            <div className="flex items-center gap-1 rounded-lg border border-border p-1 bg-muted/30">
              <button
                type="button"
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${scope === 'mine' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setScope('mine')}
              >
                My Activity
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${scope === 'all' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setScope('all')}
              >
                All Users
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {loading && records.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
              Loading activity history...
            </div>
          ) : records.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
              No activity history found.
            </div>
          ) : (
            records.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between gap-4 p-4 border border-border rounded-xl hover:border-primary/40 transition-all bg-card/50"
              >
                <div>
                  <p className="font-medium text-foreground">{activity.summary || activity.action || 'Activity recorded'}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {activity.entity_type?.replace(/_/g, ' ') || 'general'}
                    {activity.actor_name ? ` | ${activity.actor_name}` : ''}
                    {activity.entity_id ? ` | ${activity.entity_id}` : ''}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {activity.created_at ? new Date(activity.created_at).toLocaleString() : ''}
                </span>
              </div>
            ))
          )}
        </div>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className="px-5 py-2 rounded-lg border border-primary/30 text-primary font-semibold hover:bg-primary/10 transition-colors disabled:opacity-60"
              onClick={() => void loadActivities(offset, false)}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
