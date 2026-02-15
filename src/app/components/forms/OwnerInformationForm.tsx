import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import { useParams } from "react-router-dom";

export function OwnerInformationForm() {
  const { stationId } = useParams();
  const { accessMode, selectedStation } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(selectedStation);

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

  useEffect(() => {
    const fetchStationAndRecords = async () => {
      let targetStation = selectedStation;

      if (!targetStation && stationId && stationId !== 'new-station') {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.get(`${API_BASE_URL}/stations/${stationId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          targetStation = response.data.data;
          setCurrentStation(targetStation);
        } catch (error) {
          console.error("Error fetching station details:", error);
        }
      }

      if (targetStation) {
        setFormData(prev => ({ ...prev, stationCode: targetStation.station_code }));
        fetchRecords(targetStation.station_code);
      } else {
        fetchRecords();
      }
    };

    fetchStationAndRecords();
  }, [selectedStation, stationId]);

  const fetchRecords = async (stationCode?: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const code = stationCode || currentStation?.station_code;
      const url = code
        ? `${API_BASE_URL}/owners/station/${code}`
        : `${API_BASE_URL}/owners`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching owners:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`${API_BASE_URL}/owners`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Owner Information saved successfully!");
      setFormData({
        ownerId: "",
        ownerName: "",
        issueDate: "",
        issuePlace: "",
        ownerMobile: "",
        ownerAddress: "",
        ownerEmail: "",
        stationTypeCode: "",
        stationCode: selectedStation?.station_code || "",
      });
      fetchRecords();
      setViewMode('records');
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
              <input
                type="text"
                value={formData.stationTypeCode}
                onChange={(e) => setFormData({ ...formData, stationTypeCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Station Code <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.stationCode}
                onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                required
                disabled={isReadOnly || !!selectedStation}
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
                {loading ? "Saving..." : "Save Owner Information"}
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Owner Information"
          columns={["Owner ID", "Name", "Mobile", "Email", "Station Code"]}
          records={records.map(r => ({
            "Owner ID": r.owner_id,
            "Name": r.owner_name,
            "Mobile": r.owner_mobile || "N/A",
            "Email": r.owner_email || "N/A",
            "Station Code": r.station_code
          }))}
        />
      )}
    </div>
  );
}
