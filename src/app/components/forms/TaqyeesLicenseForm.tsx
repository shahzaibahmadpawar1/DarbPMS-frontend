import { useEffect, useState } from "react";
import { Save, List, Eye, FileCheck } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import { useResolvedStationCode } from "../../hooks/useResolvedStationCode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

function LicenseField({ label, name, value, type = "text", onChange, disabled }: {
  label: string; name: string; value: string; type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-muted-foreground mb-1">{label}</label>
      {name === "licenseStatus" ? (
        <select name={name} value={value} onChange={onChange} disabled={disabled}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground">
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending Renewal</option>
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} disabled={disabled}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" />
      )}
    </div>
  );
}

export function TaqyeesLicenseForm() {
  const { accessMode } = useStation();
  const resolvedStationCode = useResolvedStationCode();
  const isReadOnly = accessMode === 'view-only';
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');

  const [formData, setFormData] = useState({
    licenseNo: isReadOnly ? "TAQ-2024-55109" : "",
    issuanceDate: isReadOnly ? "2024-03-01" : "",
    licenseExpiryDate: isReadOnly ? "2025-03-01" : "",
    numberOfDays: isReadOnly ? "180" : "",
    licenseStatus: isReadOnly ? "active" : "",
    stationCode: isReadOnly ? "N101" : "",
    officeCode: isReadOnly ? "OFF-772" : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!resolvedStationCode || isReadOnly) return;
    setFormData((prev) => ({ ...prev, stationCode: prev.stationCode || resolvedStationCode }));
  }, [resolvedStationCode, isReadOnly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("auth_token");
    const stationCode = formData.stationCode || resolvedStationCode;

    if (!token) {
      alert("Authentication required. Please login again.");
      return;
    }

    if (!formData.licenseNo || !stationCode) {
      alert("License No and Station Code are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/government-licenses/taqyees`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          stationCode,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || "Failed to save Taqyees license");
      }

      alert("Taqyees License saved successfully!");
    } catch (error: any) {
      alert(error?.message || "Failed to save Taqyees License");
    }
  };

  const mockRecords = [
    { "License No": "TAQ-2024-551", "Station Code": "ST-201", "Issue Date": "2024-02-01", "Expiry Date": "2025-02-01", "Status": "Active" },
    { "License No": "TAQ-2024-610", "Station Code": "ST-203", "Issue Date": "2023-12-15", "Expiry Date": "2024-12-15", "Status": "Active" },
  ];

  const fields: { label: string; name: string; type?: string }[] = [
    { label: "License No", name: "licenseNo" },
    { label: "Issuance Date", name: "issuanceDate", type: "date" },
    { label: "License Expiry Date", name: "licenseExpiryDate", type: "date" },
    { label: "Number of Days", name: "numberOfDays", type: "number" },
    { label: "License Status", name: "licenseStatus" },
    { label: "Station Code", name: "stationCode" },
    { label: "Office Code", name: "officeCode" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Taqyees License (Standardization)</h1>
          <p className="text-muted-foreground mt-2">Manage equipment calibration and standardization certifications</p>
        </div>
        {isReadOnly ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" /><span className="text-sm font-semibold">View Only Mode</span>
          </div>
        ) : (
          <div className="flex bg-muted p-1 rounded-xl w-fit">
            <button onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <FileCheck className="w-4 h-4" /><span>New Entry</span>
            </button>
            <button onClick={() => setViewMode('records')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <List className="w-4 h-4" /><span>View Records</span>
            </button>
          </div>
        )}
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={handleSubmit}
          className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.map(f => (
              <LicenseField key={f.name} label={f.label} name={f.name} value={(formData as any)[f.name]}
                type={f.type} onChange={handleChange} disabled={isReadOnly} />
            ))}
          </div>
          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button type="submit" className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20">
                <Save className="w-5 h-5" /> Save Taqyees License
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Taqyees Licenses"
          columns={["License No", "Station Code", "Issue Date", "Expiry Date", "Status"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
