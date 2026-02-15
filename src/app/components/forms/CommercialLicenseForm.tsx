import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import { useParams } from "react-router-dom";

export function CommercialLicenseForm() {
  const { stationId } = useParams();
  const { accessMode, selectedStation } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(selectedStation);

  const [formData, setFormData] = useState({
    licenseNo: "",
    paymentDueDate: "",
    issuanceDate: "",
    licenseExpiryDate: "",
    numberOfDays: "",
    licenseStatus: "",
    ownerName: "",
    ownerId: "",
    isicClassification: "",
    municipality: "",
    subMunicipality: "",
    district: "",
    street: "",
    totalSpace: "",
    signSpace: "",
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
        ? `${API_BASE_URL}/commercial-licenses/station/${code}`
        : `${API_BASE_URL}/commercial-licenses`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching commercial licenses:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`${API_BASE_URL}/commercial-licenses`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Commercial License saved successfully!");
      setFormData({
        licenseNo: "",
        paymentDueDate: "",
        issuanceDate: "",
        licenseExpiryDate: "",
        numberOfDays: "",
        licenseStatus: "",
        ownerName: "",
        ownerId: "",
        isicClassification: "",
        municipality: "",
        subMunicipality: "",
        district: "",
        street: "",
        totalSpace: "",
        signSpace: "",
        stationCode: selectedStation?.station_code || "",
      });
      fetchRecords();
      setViewMode('records');
    } catch (error: any) {
      console.error("Error saving license:", error);
      const errorMsg = error.response?.data?.error || "Failed to save license";
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
          <h1 className="text-3xl font-bold text-foreground">Commercial License</h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "View commercial licensing and compliance certificates" : "Manage commercial licensing and compliance certificates"}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div><label className="block text-sm font-medium mb-1">License No *</label>
              <input type="text" value={formData.licenseNo} onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" required disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Payment Due Date</label>
              <input type="date" value={formData.paymentDueDate} onChange={(e) => setFormData({ ...formData, paymentDueDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Issuance Date</label>
              <input type="date" value={formData.issuanceDate} onChange={(e) => setFormData({ ...formData, issuanceDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input type="date" value={formData.licenseExpiryDate} onChange={(e) => setFormData({ ...formData, licenseExpiryDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Number of Days</label>
              <input type="number" value={formData.numberOfDays} onChange={(e) => setFormData({ ...formData, numberOfDays: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">License Status</label>
              <input type="text" value={formData.licenseStatus} onChange={(e) => setFormData({ ...formData, licenseStatus: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Owner Name</label>
              <input type="text" value={formData.ownerName} onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Owner ID</label>
              <input type="text" value={formData.ownerId} onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">ISIC Classification</label>
              <input type="text" value={formData.isicClassification} onChange={(e) => setFormData({ ...formData, isicClassification: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Municipality</label>
              <input type="text" value={formData.municipality} onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Sub-Municipality</label>
              <input type="text" value={formData.subMunicipality} onChange={(e) => setFormData({ ...formData, subMunicipality: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">District</label>
              <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Street</label>
              <input type="text" value={formData.street} onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Total space</label>
              <input type="number" step="0.01" value={formData.totalSpace} onChange={(e) => setFormData({ ...formData, totalSpace: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Sign space</label>
              <input type="number" step="0.01" value={formData.signSpace} onChange={(e) => setFormData({ ...formData, signSpace: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium mb-1">Station Code *</label>
              <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-background" required disabled={isReadOnly || !!selectedStation} /></div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Commercial License"}
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Commercial Licenses"
          columns={["License No", "Owner", "Municipality", "Status", "Expiry"]}
          records={records.map(r => ({
            "License No": r.license_no,
            "Owner": r.owner_name || "N/A",
            "Municipality": r.municipality || "N/A",
            "Status": r.license_status || "N/A",
            "Expiry": r.license_expiry_date ? new Date(r.license_expiry_date).toLocaleDateString() : "N/A"
          }))}
        />
      )}
    </div>
  );
}
