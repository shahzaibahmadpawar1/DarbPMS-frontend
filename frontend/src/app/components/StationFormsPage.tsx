import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle, Activity } from "lucide-react";
import logo from "../../assets/logo.png";
import { stationSections } from "../data/formSections";
import { useStation } from "../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type CompletionMap = Record<string, boolean>;
type CompletionCache = { updatedAt: number; data: CompletionMap };
const COMPLETION_CACHE_TTL_MS = 30_000;

const FORM_COMPLETION_ENDPOINTS: Record<string, string> = {
  "cameras": "/cameras/station/{stationCode}",
  "dispensers": "/dispensers/station/{stationCode}",
  "tanks": "/tanks/station/{stationCode}",
  "areas": "/areas/station/{stationCode}",
  "owner-information": "/owners/station/{stationCode}",
  "deed-information": "/deeds/station/{stationCode}",
  "building-permit": "/building-permits/station/{stationCode}",
  "contract": "/contracts/station/{stationCode}",
  "commercial-license": "/commercial-licenses/station/{stationCode}",
  "salamah-license": "/government-licenses/salamah/station/{stationCode}",
  "taqyees-license": "/government-licenses/taqyees/station/{stationCode}",
  "environmental-license": "/government-licenses/environmental/station/{stationCode}",
  "government-license-attachments": "/government-licenses/attachments/station/{stationCode}",
  "survey-report": "/investment-projects/station/{stationCode}",
};

function hasPersistedData(data: unknown, formPath?: string): boolean {
  if (Array.isArray(data)) {
    return data.length > 0;
  }

  if (data && typeof data === "object") {
    if (formPath === "government-license-attachments") {
      const attachments = data as Record<string, unknown>;
      return [
        attachments.operating_license_url,
        attachments.petroleum_trade_license_url,
        attachments.civil_defense_certificate_url,
        attachments.safety_installations_certificate_url,
        attachments.maintenance_contract_url,
        attachments.container_contract_url,
        attachments.municipal_license_url,
      ].some(Boolean);
    }

    return Object.keys(data as Record<string, unknown>).length > 0;
  }

  return Boolean(data);
}

function getCompletionCacheKey(stationCode: string): string {
  return `stationCompletion:${stationCode}`;
}

function readCompletionCache(stationCode: string): CompletionMap | null {
  try {
    const raw = sessionStorage.getItem(getCompletionCacheKey(stationCode));
    if (!raw) return null;

    const parsed = JSON.parse(raw) as CompletionCache;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.updatedAt || typeof parsed.updatedAt !== "number") return null;
    if (!parsed.data || typeof parsed.data !== "object") return null;
    if (Date.now() - parsed.updatedAt > COMPLETION_CACHE_TTL_MS) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

function writeCompletionCache(stationCode: string, data: CompletionMap): void {
  try {
    const payload: CompletionCache = {
      updatedAt: Date.now(),
      data,
    };
    sessionStorage.setItem(getCompletionCacheKey(stationCode), JSON.stringify(payload));
  } catch {
    // Ignore storage quota / parse errors and keep runtime behavior.
  }
}

export function StationFormsPage() {
  const { stationId } = useParams();
  const { setSelectedStation } = useStation();
  const [loading, setLoading] = useState(true);
  const [station, setStation] = useState<any | null>(null);
  const [completionByPath, setCompletionByPath] = useState<CompletionMap>({});

  useEffect(() => {
    const fetchStation = async () => {
      if (!stationId) return;
      const token = localStorage.getItem("auth_token");

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const getLocalCompletionFlag = (stationCode: string, path: string): boolean => {
        return localStorage.getItem(`stationFormCompleted:${stationCode}:${path}`) === "true";
      };

      const fetchEndpointHasData = async (path: string, endpointTemplate: string, stationCode: string): Promise<boolean> => {
        const endpoint = endpointTemplate.replace("{stationCode}", encodeURIComponent(stationCode));

        try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
          if (!response.ok) return false;

          const payload = await response.json();
          return hasPersistedData(payload?.data, path);
        } catch {
          return false;
        }
      };

      const resolveNozzlesCompletion = async (stationCode: string): Promise<boolean> => {
        try {
          const dispensersRes = await fetch(`${API_BASE_URL}/dispensers/station/${encodeURIComponent(stationCode)}`, { headers });
          if (!dispensersRes.ok) return false;

          const dispensersPayload = await dispensersRes.json();
          const dispensers = Array.isArray(dispensersPayload?.data) ? dispensersPayload.data : [];
          if (dispensers.length === 0) return false;

          const nozzleChecks = await Promise.all(
            dispensers.map(async (dispenser: any) => {
              const serial = dispenser?.dispenser_serial_number || dispenser?.serial_number || dispenser?.serialNumber;
              if (!serial) return false;

              const nozzlesRes = await fetch(`${API_BASE_URL}/nozzles/dispenser/${encodeURIComponent(serial)}`, { headers });
              if (!nozzlesRes.ok) return false;

              const nozzlesPayload = await nozzlesRes.json();
              return hasPersistedData(nozzlesPayload?.data);
            })
          );

          return nozzleChecks.some(Boolean);
        } catch {
          return false;
        }
      };

      const resolveCompletion = async (stationCode: string): Promise<CompletionMap> => {
        const completionEntries = await Promise.all(
          Object.entries(FORM_COMPLETION_ENDPOINTS).map(async ([path, endpointTemplate]) => {
            const completed = await fetchEndpointHasData(path, endpointTemplate, stationCode);
            return [path, completed] as const;
          })
        );

        const completion = Object.fromEntries(completionEntries) as CompletionMap;
        completion["station-information"] = true;
        completion["nozzles"] = await resolveNozzlesCompletion(stationCode);
        completion["survey-report"] = completion["survey-report"] || getLocalCompletionFlag(stationCode, "survey-report");
        completion["fixed-assets"] = getLocalCompletionFlag(stationCode, "fixed-assets");

        if (typeof completion["fixed-assets"] === "undefined") {
          completion["fixed-assets"] = false;
        }

        return completion;
      };

      try {
        const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
          headers,
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

        const cachedCompletion = readCompletionCache(s.station_code);
        if (cachedCompletion) {
          setCompletionByPath(cachedCompletion);
        }

        // Refresh completion asynchronously so the page paints quickly on navigation.
        void resolveCompletion(s.station_code).then((completion) => {
          setCompletionByPath(completion);
          writeCompletionCache(s.station_code, completion);
        });
      } catch {
        setStation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStation();
  }, [stationId, setSelectedStation]);

  const sectionsWithCompletion = stationSections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({
      ...item,
      completed: Boolean(completionByPath[item.path]),
    })),
  }));

  const totalForms = sectionsWithCompletion.reduce((sum, section) => sum + section.items.length, 0);
  const formsCompleted = sectionsWithCompletion.reduce((sum, section) => sum + section.items.filter((item) => item.completed).length, 0);

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

  const completionPercentage = totalForms > 0 ? Math.round((formsCompleted / totalForms) * 100) : 0;

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
            <span className="text-xs font-bold text-primary">{formsCompleted}/{totalForms} ({completionPercentage}%)</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full gradient-primary rounded-full" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sectionsWithCompletion.map((section) => (
            <div key={section.group} className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{section.group}</h4>
              {section.items.map((item) => (
                <Link
                  key={item.title}
                  to={`/station/${station.id}/form/${item.path}`}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border group bg-card text-foreground border-border hover:bg-muted/40 hover:border-primary/20"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {item.completed && <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
