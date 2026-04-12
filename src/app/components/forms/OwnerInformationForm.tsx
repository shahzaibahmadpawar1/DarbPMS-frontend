import { useState, useEffect } from "react";
import { Save, Eye } from "lucide-react";
import { useStation } from "../../context/StationContext";
import { useAutoPopulate } from "../../hooks/useAutoPopulate";
import { useResolvedStationCode } from "../../hooks/useResolvedStationCode";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export function OwnerInformationForm() {
  const { accessMode, selectedStation } = useStation();
  const { investmentProjectData, clearInvestmentProjectData } = useAutoPopulate();
  const resolvedStationCode = useResolvedStationCode();
  const isReadOnly = accessMode === 'view-only';
  const stationTypes = ["operation", "rent", "franchise", "investment", "ownership"];

  const [loading, setLoading] = useState(false);
  const [existingOwnerId, setExistingOwnerId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    ownerId: "",
    ownerName: "",
    issueDate: "",
    issuePlace: "",
    ownerMobile: "",
    ownerAddress: "",
    ownerEmail: "",
    stationTypeCode: "",
    stationCode: "",
  });

  const fetchExistingOwner = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const code = String(resolvedStationCode || selectedStation?.station_code || '').trim();
      if (!code) {
        return;
      }

      setFormData((prev) => (prev.stationCode === code ? prev : { ...prev, stationCode: code }));

      const response = await axios.get(`${API_BASE_URL}/owners/station/${code}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const row = Array.isArray(response.data?.data) ? response.data.data[0] : null;
      if (row) {
        const nextExistingOwnerId = String(row.id);
        setExistingOwnerId((prev) => (prev === nextExistingOwnerId ? prev : nextExistingOwnerId));

        setFormData((prev) => {
          const next = {
            ...prev,
            ownerId: row.owner_id || prev.ownerId,
            ownerName: row.owner_name || prev.ownerName,
            issueDate: row.issue_date ? String(row.issue_date).slice(0, 10) : prev.issueDate,
            issuePlace: row.issue_place || prev.issuePlace,
            ownerMobile: row.owner_mobile || prev.ownerMobile,
            ownerAddress: row.owner_address || prev.ownerAddress,
            ownerEmail: row.owner_email || prev.ownerEmail,
            stationTypeCode: row.station_type_code || prev.stationTypeCode,
            stationCode: row.station_code || prev.stationCode,
          };

          const changed =
            next.ownerId !== prev.ownerId ||
            next.ownerName !== prev.ownerName ||
            next.issueDate !== prev.issueDate ||
            next.issuePlace !== prev.issuePlace ||
            next.ownerMobile !== prev.ownerMobile ||
            next.ownerAddress !== prev.ownerAddress ||
            next.ownerEmail !== prev.ownerEmail ||
            next.stationTypeCode !== prev.stationTypeCode ||
            next.stationCode !== prev.stationCode;

          return changed ? next : prev;
        });
      }
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  useEffect(() => {
    fetchExistingOwner();
  }, [resolvedStationCode, selectedStation?.station_code]);

  useEffect(() => {
    if (!investmentProjectData) {
      return;
    }

    setFormData((prev) => {
      const next = {
        ...prev,
        ownerId: prev.ownerId || investmentProjectData.idNo || prev.ownerId,
        ownerName: prev.ownerName || investmentProjectData.ownerName || prev.ownerName,
        ownerMobile: prev.ownerMobile || investmentProjectData.ownerContactNo || prev.ownerMobile,
        ownerAddress: prev.ownerAddress || investmentProjectData.nationalAddress || prev.ownerAddress,
        ownerEmail: prev.ownerEmail || investmentProjectData.email || prev.ownerEmail,
      };

      const changed =
        next.ownerId !== prev.ownerId ||
        next.ownerName !== prev.ownerName ||
        next.ownerMobile !== prev.ownerMobile ||
        next.ownerAddress !== prev.ownerAddress ||
        next.ownerEmail !== prev.ownerEmail;

      return changed ? next : prev;
    });
  }, [investmentProjectData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const payload = {
        ...formData,
        stationCode: formData.stationCode || resolvedStationCode || selectedStation?.station_code || '',
      };

      if (existingOwnerId) {
        await axios.put(`${API_BASE_URL}/owners/${existingOwnerId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_BASE_URL}/owners`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      alert(existingOwnerId ? "Owner Information updated successfully!" : "Owner Information saved successfully!");
      clearInvestmentProjectData();
      await fetchExistingOwner();
    } catch (error: any) {
      console.error("Error saving owner:", error);
      const errorMsg = error.response?.data?.error || "Failed to save owner information";
      const details = error.response?.data?.details ? `\nDetails: ${error.response.data.details}` : "";
      alert(`${errorMsg}${details}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Owner Information</h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "View owner details" : "Manage station owner details and contact information"}
          </p>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Owner ID/National ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.ownerId}
            onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            required
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">
            Owner Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            required
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Issue Date</label>
          <input
            type="date"
            value={formData.issueDate}
            onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Issue Place</label>
          <input
            type="text"
            value={formData.issuePlace}
            onChange={(e) => setFormData({ ...formData, issuePlace: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Mobile</label>
          <input
            type="tel"
            value={formData.ownerMobile}
            onChange={(e) => setFormData({ ...formData, ownerMobile: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Email</label>
          <input
            type="email"
            value={formData.ownerEmail}
            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            disabled={isReadOnly}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Address</label>
          <textarea
            value={formData.ownerAddress}
            onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            rows={3}
            disabled={isReadOnly}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Station Type Code</label>
          <select
            value={formData.stationTypeCode}
            onChange={(e) => setFormData({ ...formData, stationTypeCode: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            disabled={isReadOnly}
          >
            <option value="">Select Type</option>
            {stationTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-1">Station Code <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={formData.stationCode}
            onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
            required
            disabled={isReadOnly || !!selectedStation || !!resolvedStationCode}
          />
        </div>
      </div>

      {!isReadOnly && (
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? "Saving..." : (existingOwnerId ? "Update Owner Information" : "Save Owner Information")}
          </button>
        </div>
      )}
      </form>
    </div>
  );
}
