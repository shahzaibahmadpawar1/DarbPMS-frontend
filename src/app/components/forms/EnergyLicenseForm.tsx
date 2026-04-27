import { useEffect, useState } from "react";
import { Save, List, PlusCircle, Eye, Send } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function EnergyLicenseForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    licenseNumber: isReadOnly ? "EN-2024-00129" : "",
    issuanceDate: isReadOnly ? "2024-01-10" : "",
    expiryDate: isReadOnly ? "2025-01-10" : "",
    numberOfDays: isReadOnly ? "180" : "",
    licenseStatus: isReadOnly ? "active" : "",
    stationCode: isReadOnly ? "N101" : "",
    officeCode: isReadOnly ? "OFF-204" : "",
  });

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/energy-licenses`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) return;
        const result = await response.json();
        setRecords(result?.data || []);
      } catch (error) {
        console.error('Error fetching energy license records:', error);
      }
    };

    void fetchRecords();
  }, []);

  useEffect(() => {
    const loadLatestSaved = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token || isReadOnly) return;

        const params = new URLSearchParams();
        if (formData.stationCode) params.set('stationCode', formData.stationCode);

        const response = await fetch(`${API_BASE_URL}/energy-licenses/latest-saved?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) return;
        const result = await response.json();
        const saved = result?.data;
        if (!saved?.id) return;

        setDraftId(saved.id);
        setFormData({
          licenseNumber: saved.license_number || "",
          issuanceDate: saved.issuance_date ? String(saved.issuance_date).slice(0, 10) : "",
          expiryDate: saved.expiry_date ? String(saved.expiry_date).slice(0, 10) : "",
          numberOfDays: saved.number_of_days != null ? String(saved.number_of_days) : "",
          licenseStatus: saved.license_status || "",
          stationCode: saved.station_code || "",
          officeCode: saved.office_code || "",
        });
      } catch (error) {
        console.error('Error loading latest saved energy license:', error);
      }
    };

    void loadLatestSaved();
  }, [isReadOnly]);

  const persistEnergyLicense = async (mode: 'save' | 'submit') => {
    if (mode === 'submit') setSubmitting(true); else setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Authentication required. Please login again.');
        return;
      }

      const response = await fetch(
        draftId ? `${API_BASE_URL}/energy-licenses/${draftId}` : `${API_BASE_URL}/energy-licenses`,
        {
          method: draftId ? 'PUT' : 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...formData, submit: mode === 'submit' }),
        },
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.error || `Failed to ${mode} energy license`);
      }

      setDraftId(result?.data?.id || draftId);

      if (mode === 'submit') {
        alert('Energy License submitted successfully!');
        setDraftId(null);
        setFormData({
          licenseNumber: "",
          issuanceDate: "",
          expiryDate: "",
          numberOfDays: "",
          licenseStatus: "",
          stationCode: "",
          officeCode: "",
        });
      } else {
        alert('Energy License saved successfully! You can continue later.');
      }
    } catch (error: any) {
      alert(error?.message || `Failed to ${mode} energy license`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const recordsView = records.map((record: any) => ({
    "License No": record.license_number || "N/A",
    "Station": record.station_code || "N/A",
    "Issue Date": record.issuance_date ? new Date(record.issuance_date).toLocaleDateString() : "N/A",
    "Expiry Date": record.expiry_date ? new Date(record.expiry_date).toLocaleDateString() : "N/A",
    "Status": record.license_status || "N/A",
  }));

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Energy License</h1>
          <p className="text-muted-foreground mt-2">Manage energy and utility operation licenses</p>
        </div>

        {!isReadOnly && (
          <div className="flex bg-muted p-1 rounded-xl w-fit">
            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Entry</span>
            </button>
            <button
              onClick={() => setViewMode('records')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <List className="w-4 h-4" />
              <span>View Records</span>
            </button>
          </div>
        )}

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={(e) => e.preventDefault()} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-muted-foreground mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type={key.includes('Date') ? 'date' : key.includes('Days') ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                />
              </div>
            ))}
          </div>

          {!isReadOnly && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                disabled={loading || submitting}
                onClick={() => void persistEnergyLicense('save')}
                className="border border-border px-6 py-3 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                disabled={loading || submitting}
                onClick={() => void persistEnergyLicense('submit')}
                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-60"
              >
                <Send className="w-5 h-5" /> {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Energy Licenses"
          columns={["License No", "Station", "Issue Date", "Expiry Date", "Status"]}
          records={recordsView}
        />
      )}
    </div>
  );
}
