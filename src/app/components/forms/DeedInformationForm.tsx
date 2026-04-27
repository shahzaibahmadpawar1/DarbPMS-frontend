import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Eye, Send } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import { useParams } from "react-router-dom";

export function DeedInformationForm() {
  const { stationId } = useParams();
  const { accessMode, selectedStation } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(selectedStation);

  const [formData, setFormData] = useState({
    deedNo: "",
    deedDate: "",
    deedIssueBy: "",
    realEstateUnitNumber: "",
    area: "",
    nationality: "",
    percentage: "",
    address: "",
    idType: "",
    idDate: "",
    landNo: "",
    blockNumber: "",
    district: "",
    city: "",
    unitType: "",
    statusCode: "",
    stationCode: "",
  });

  useEffect(() => {
    const hydrateForm = async () => {
      let targetStation = selectedStation;

      if (!targetStation && stationId && stationId !== 'new-station') {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.get(`${API_BASE_URL}/stations/${stationId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          targetStation = response.data.data;
        } catch (error) {
          console.error("Error fetching station details:", error);
        }
      }

      if (targetStation) {
        setCurrentStation(targetStation);
      }

      const stationCode = targetStation?.station_code || "";
      if (stationCode) {
        setFormData(prev => prev.stationCode === stationCode ? prev : { ...prev, stationCode });
      }

      await fetchRecords(stationCode || undefined);

      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const params = new URLSearchParams();
        if (stationCode) params.set('stationCode', stationCode);

        const response = await axios.get(`${API_BASE_URL}/deeds/latest-saved?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const saved = response.data?.data;
        if (!saved?.id) return;

        setDraftId(saved.id);
        setFormData({
          deedNo: saved.deed_no || "",
          deedDate: saved.deed_date ? String(saved.deed_date).slice(0, 10) : "",
          deedIssueBy: saved.deed_issue_by || "",
          realEstateUnitNumber: saved.real_estate_unit_number || "",
          area: saved.area != null ? String(saved.area) : "",
          nationality: saved.nationality || "",
          percentage: saved.percentage != null ? String(saved.percentage) : "",
          address: saved.address || "",
          idType: saved.id_type || "",
          idDate: saved.id_date ? String(saved.id_date).slice(0, 10) : "",
          landNo: saved.land_no || "",
          blockNumber: saved.block_number || "",
          district: saved.district || "",
          city: saved.city || "",
          unitType: saved.unit_type || "",
          statusCode: saved.status_code || "",
          stationCode: saved.station_code || stationCode,
        });
      } catch (error) {
        console.error("Error loading latest saved deed:", error);
      }
    };

    void hydrateForm();
  }, [selectedStation, stationId]);

  const fetchRecords = async (stationCode?: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const code = stationCode || currentStation?.station_code;
      const url = code
        ? `${API_BASE_URL}/deeds/station/${code}`
        : `${API_BASE_URL}/deeds`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching deeds:", error);
    }
  };

  const persistDeed = async (mode: 'save' | 'submit') => {
    if (mode === 'submit') setSubmitting(true); else setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const payload = { ...formData, submit: mode === 'submit' };
      const response = draftId
        ? await axios.put(`${API_BASE_URL}/deeds/${draftId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        : await axios.post(`${API_BASE_URL}/deeds`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.data?.id) {
        setDraftId(response.data.data.id);
      }

      if (mode === 'submit') {
        alert("Deed information submitted successfully!");
        setDraftId(null);
        setFormData({
          deedNo: "",
          deedDate: "",
          deedIssueBy: "",
          realEstateUnitNumber: "",
          area: "",
          nationality: "",
          percentage: "",
          address: "",
          idType: "",
          idDate: "",
          landNo: "",
          blockNumber: "",
          district: "",
          city: "",
          unitType: "",
          statusCode: "",
          stationCode: selectedStation?.station_code || "",
        });
      } else {
        alert("Deed information saved successfully! You can continue later.");
      }

      fetchRecords();
      setViewMode('records');
    } catch (error: any) {
      console.error(`Error during deed ${mode}:`, error);
      const errorMsg = error.response?.data?.error || `Failed to ${mode} deed information`;
      const details = error.response?.data?.details ? `\nDetails: ${error.response.data.details}` : "";
      alert(`${errorMsg}${details}`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deed Information</h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "View land registry and property ownership deed" : "Manage land registry and property ownership deeds"}
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Deed No <span className="text-red-500">*</span></label>
              <input type="text" value={formData.deedNo} onChange={(e) => setFormData({ ...formData, deedNo: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" required disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Deed Date</label>
              <input type="date" value={formData.deedDate} onChange={(e) => setFormData({ ...formData, deedDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Deed Issue By</label>
              <input type="text" value={formData.deedIssueBy} onChange={(e) => setFormData({ ...formData, deedIssueBy: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Real Estate Unit Number</label>
              <input type="text" value={formData.realEstateUnitNumber} onChange={(e) => setFormData({ ...formData, realEstateUnitNumber: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Area</label>
              <input type="number" step="0.01" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Nationality</label>
              <input type="text" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Percentage (%)</label>
              <input type="number" step="0.01" value={formData.percentage} onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">ID Type</label>
              <input type="text" value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">ID Date</label>
              <input type="date" value={formData.idDate} onChange={(e) => setFormData({ ...formData, idDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Land No</label>
              <input type="text" value={formData.landNo} onChange={(e) => setFormData({ ...formData, landNo: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Block Number</label>
              <input type="text" value={formData.blockNumber} onChange={(e) => setFormData({ ...formData, blockNumber: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">District</label>
              <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Unit Type</label>
              <input type="text" value={formData.unitType} onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Status Code</label>
              <input type="text" value={formData.statusCode} onChange={(e) => setFormData({ ...formData, statusCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Station Code <span className="text-red-500">*</span></label>
              <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" required disabled={isReadOnly || !!selectedStation} />
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-6 gap-3">
              <button
                type="button"
                onClick={() => void persistDeed('save')}
                disabled={loading || submitting}
                className="border border-border px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Deed Information"}
              </button>
              <button
                type="button"
                onClick={() => void persistDeed('submit')}
                disabled={loading || submitting}
                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                {submitting ? "Submitting..." : "Submit Deed Information"}
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Deed Information"
          columns={["Deed No", "City", "Area", "District", "Station Code"]}
          records={records.map(r => ({
            "Deed No": r.deed_no,
            "City": r.city || "N/A",
            "Area": r.area || "0",
            "District": r.district || "N/A",
            "Station Code": r.station_code
          }))}
        />
      )}
    </div>
  );
}
