import { useEffect, useMemo, useRef, useState } from "react";
import { Building2, Check, ChevronDown, MessageSquare, Send, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { departmentOptions, getRoleLabel, type Department } from "@/services/api";
import { getRequestTypesByDepartment, type RequestTypeValue } from "@/app/constants/requestTypes";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/app/components/ui/utils";

interface StationOption {
    station_code: string;
    station_name: string;
}

interface RequestFormData {
    requestType: RequestTypeValue | "";
    department: Department | "";
    priority: string;
    requester: string;
    subject: string;
    dueDate: string;
    description: string;
    stationCodes: string[];
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const initialFormState = (requester = "", department = ""): RequestFormData => ({
    requestType: "",
    department: department as Department | "",
    priority: "medium",
    requester,
    subject: "",
    dueDate: "",
    description: "",
    stationCodes: [],
});

export function RequestPage() {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState<RequestFormData>(() => initialFormState());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [stations, setStations] = useState<StationOption[]>([]);
    const stationPickerRef = useRef<HTMLDivElement | null>(null);
    const [stationPickerOpen, setStationPickerOpen] = useState(false);
    const [stationSearch, setStationSearch] = useState("");

    const departmentRequestTypes = useMemo(
        () => getRequestTypesByDepartment(formData.department),
        [formData.department],
    );

    const selectedStationSet = useMemo(() => new Set(formData.stationCodes), [formData.stationCodes]);

    const selectedStations = useMemo(
        () => stations.filter((station) => selectedStationSet.has(station.station_code)),
        [selectedStationSet, stations],
    );

    const sortedStations = useMemo(() => {
        const query = stationSearch.trim().toLowerCase();

        return [...stations]
            .filter((station) => {
                if (!query) {
                    return true;
                }

                return (
                    station.station_code.toLowerCase().includes(query) ||
                    station.station_name.toLowerCase().includes(query)
                );
            })
            .sort((left, right) => {
            const leftSelected = selectedStationSet.has(left.station_code);
            const rightSelected = selectedStationSet.has(right.station_code);

            if (leftSelected !== rightSelected) {
                return leftSelected ? -1 : 1;
            }

            return `${left.station_code} ${left.station_name}`.localeCompare(`${right.station_code} ${right.station_name}`);
            });
    }, [selectedStationSet, stationSearch, stations]);

    useEffect(() => {
        if (!stationPickerOpen) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (!stationPickerRef.current) {
                return;
            }

            if (!stationPickerRef.current.contains(event.target as Node)) {
                setStationPickerOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        return () => document.removeEventListener("mousedown", handlePointerDown);
    }, [stationPickerOpen]);

    useEffect(() => {
        if (!user) return;

        const roleLabel = getRoleLabel(user.role);
        setFormData((prev) => ({
            ...prev,
            requester: `${user.username || "Requester"} (${roleLabel})`,
            department: prev.department || (user.department ? user.department : ""),
        }));
    }, [user]);

    useEffect(() => {
        if (!token) return;

        const loadStations = async () => {
            try {
                const response = await fetch(`${API_URL}/stations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) return;

                const result = await response.json();
                const stationData = Array.isArray(result?.data) ? result.data : [];
                const normalized = stationData
                    .map((station: any) => ({
                        station_code: String(station.station_code || ""),
                        station_name: String(station.station_name || station.station_code || ""),
                    }))
                    .filter((station: StationOption) => station.station_code.length > 0);

                setStations(normalized);
            } catch (error) {
                console.error("Failed to load stations:", error);
            }
        };

        void loadStations();
    }, [token]);

    useEffect(() => {
        if (!formData.department || !formData.requestType) return;
        const isValidSelection = departmentRequestTypes.some((option) => option.value === formData.requestType);
        if (!isValidSelection) {
            setFormData((prev) => ({ ...prev, requestType: "" }));
        }
    }, [departmentRequestTypes, formData.department, formData.requestType]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!token) {
            alert("Please log in again before submitting a request.");
            return;
        }

        if (!formData.department || !formData.requestType || !formData.subject.trim() || !formData.description.trim()) {
            alert("Select a department, request type, subject, and description.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/requests/submit`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestType: formData.requestType,
                    department: formData.department,
                    priority: formData.priority,
                    subject: formData.subject,
                    dueDate: formData.dueDate,
                    description: formData.description,
                    stationCodes: formData.stationCodes,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error?.error || "Failed to submit request");
                return;
            }

            alert("Request submitted. The department manager will review it in tasks.");
            setFormData((prev) => ({
                ...initialFormState(prev.requester, prev.department),
                department: prev.department as Department | "",
                requester: prev.requester,
            }));
        } catch (error) {
            console.error("Failed to submit request:", error);
            alert("Failed to submit request");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col gap-3">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Requests</h1>
                    <p className="text-muted-foreground mt-2">Submit a request to the relevant department manager for review.</p>
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <User className="w-4 h-4 text-primary" /> Requester
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">{formData.requester || "Ready to submit"}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Building2 className="w-4 h-4 text-primary" /> Department routing
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">Task goes to the department manager</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <MessageSquare className="w-4 h-4 text-primary" /> Response tracking
                        </div>
                        <p className="mt-2 text-sm font-semibold text-foreground">Approval or rejection appears in your tasks</p>
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
                <div className="mb-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
                        Request Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.department}
                                onChange={(event) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        department: event.target.value as Department | "",
                                        requestType: "",
                                    }))
                                }
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                required
                            >
                                <option value="">Select Department</option>
                                {departmentOptions.map((department) => (
                                    <option key={department.value} value={department.value}>
                                        {department.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Request Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.requestType}
                                onChange={(event) => setFormData((prev) => ({ ...prev, requestType: event.target.value as RequestTypeValue }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                required
                                disabled={!formData.department}
                            >
                                <option value="">Select Request Type</option>
                                {departmentRequestTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Stations (Optional)</label>
                            <div ref={stationPickerRef} className="relative">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStationPickerOpen((prev) => !prev)}
                                    className="w-full justify-between px-3 py-2 h-auto min-h-10 text-left font-normal"
                                >
                                    <span className="truncate">
                                        {selectedStations.length > 0
                                            ? selectedStations.map((station) => station.station_code).join(", ")
                                            : "Search and select one or more stations"}
                                    </span>
                                    <ChevronDown className="h-4 w-4 opacity-60" />
                                </Button>

                                {stationPickerOpen ? (
                                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-xl border border-border bg-background shadow-xl">
                                        <div className="border-b border-border p-3">
                                            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Search stations
                                            </label>
                                            <input
                                                autoFocus
                                                value={stationSearch}
                                                onChange={(event) => setStationSearch(event.target.value)}
                                                placeholder="Type a station code or name"
                                                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-0 focus:border-primary"
                                            />
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Selected stations stay at the top of the list.
                                            </p>
                                        </div>

                                        <div className="max-h-72 overflow-y-auto p-2">
                                            {sortedStations.length > 0 ? (
                                                sortedStations.map((station) => {
                                                    const checked = selectedStationSet.has(station.station_code);

                                                    return (
                                                        <label
                                                            key={station.station_code}
                                                            onClick={() => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    stationCodes: checked
                                                                        ? prev.stationCodes.filter((code) => code !== station.station_code)
                                                                        : [...prev.stationCodes, station.station_code],
                                                                }));
                                                            }}
                                                            className={cn(
                                                                "flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground",
                                                                checked && "bg-accent/60",
                                                            )}
                                                        >
                                                            <div className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-background">
                                                                {checked ? (
                                                                    <Check className="h-3 w-3 text-primary" strokeWidth={3} />
                                                                ) : null}
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="truncate text-sm font-medium text-foreground">
                                                                        {station.station_code}
                                                                    </span>
                                                                    {checked ? <Check className="h-4 w-4 text-primary" /> : null}
                                                                </div>
                                                                <p className="truncate text-sm text-muted-foreground">{station.station_name}</p>
                                                            </div>
                                                        </label>
                                                    );
                                                })
                                            ) : (
                                                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                                                    No stations found.
                                                </div>
                                            )}
                                        </div>

                                        <div className="border-t border-border p-3 text-xs text-muted-foreground">
                                            Search by station code or name. Check a row to select or clear it.
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            {selectedStations.length > 0 ? (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {selectedStations.map((station) => (
                                        <button
                                            key={station.station_code}
                                            type="button"
                                            onClick={() => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    stationCodes: prev.stationCodes.filter((code) => code !== station.station_code),
                                                }));
                                            }}
                                            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                                        >
                                            <span>{station.station_code}</span>
                                            <span className="max-w-40 truncate text-muted-foreground">{station.station_name}</span>
                                            <X className="h-3 w-3 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>
                            ) : null}
                            <p className="text-xs text-muted-foreground mt-1">
                                Search by station code or name, then check the stations you want. Selected stations are grouped first.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Requester</label>
                            <input
                                type="text"
                                value={formData.requester}
                                readOnly
                                className="w-full px-3 py-2 border border-border rounded-lg bg-muted/40 text-foreground"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(event) => setFormData((prev) => ({ ...prev, priority: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Subject <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                placeholder="Brief subject of the request"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Due Date</label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-muted-foreground mb-1">Detailed Description <span className="text-red-500">*</span></label>
                            <textarea
                                value={formData.description}
                                onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                                rows={5}
                                placeholder="Describe the request in detail so the department manager can review it."
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-60"
                    >
                        <Send className="w-5 h-5" />
                        {isSubmitting ? "Submitting..." : "Send Request"}
                    </button>
                </div>
            </form>
        </div>
    );
}

