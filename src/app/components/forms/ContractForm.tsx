import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Eye, FileText } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import { useParams } from "react-router-dom";

export function ContractForm() {
  const { stationId } = useParams();
  const { accessMode, selectedStation } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(selectedStation);

  const [formData, setFormData] = useState({
    contractNo: "",
    contractType: "",
    contractSignatureDate: "",
    contractSignatureLocation: "",
    tenancyStartDate: "",
    tenancyEndDate: "",
    lessorName: "",
    nationality: "",
    idType: "",
    idNo: "",
    idCopy: "",
    mobileNo: "",
    email: "",
    tenantName: "",
    tenantNationality: "",
    tenantIdType: "",
    tenantIdNo: "",
    tenantIdCopy: "",
    tenantMobileNo: "",
    tenantEmail: "",
    duration: "",
    days: "",
    propertyValue: "",
    installments: "",
    dueDate: "",
    dueAmount: "",
    paidAmount: "",
    notPaidAmount: "",
    duePeriod: "",
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
        ? `${API_BASE_URL}/contracts/station/${code}`
        : `${API_BASE_URL}/contracts`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`${API_BASE_URL}/contracts`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Contract saved successfully!");
      setFormData({
        contractNo: "",
        contractType: "",
        contractSignatureDate: "",
        contractSignatureLocation: "",
        tenancyStartDate: "",
        tenancyEndDate: "",
        lessorName: "",
        nationality: "",
        idType: "",
        idNo: "",
        idCopy: "",
        mobileNo: "",
        email: "",
        tenantName: "",
        tenantNationality: "",
        tenantIdType: "",
        tenantIdNo: "",
        tenantIdCopy: "",
        tenantMobileNo: "",
        tenantEmail: "",
        duration: "",
        days: "",
        propertyValue: "",
        installments: "",
        dueDate: "",
        dueAmount: "",
        paidAmount: "",
        notPaidAmount: "",
        duePeriod: "",
        stationCode: selectedStation?.station_code || "",
      });
      fetchRecords();
      setViewMode('records');
    } catch (error: any) {
      console.error("Error saving contract:", error);
      const errorMsg = error.response?.data?.error || "Failed to save contract";
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
          <h1 className="text-3xl font-bold text-foreground">Contract Management</h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "View lease and rent agreement details" : "Manage lease and rent agreement details"}
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
          <div className="space-y-8">
            {/* Section 1: Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Basic Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Contract No *</label>
                  <input type="text" value={formData.contractNo} onChange={(e) => setFormData({ ...formData, contractNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" required disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Contract Type</label>
                  <input type="text" value={formData.contractType} onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Station Code *</label>
                  <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" required disabled={isReadOnly || !!selectedStation} /></div>
                <div><label className="block text-sm font-medium mb-1">Signature Date</label>
                  <input type="date" value={formData.contractSignatureDate} onChange={(e) => setFormData({ ...formData, contractSignatureDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Signature Location</label>
                  <input type="text" value={formData.contractSignatureLocation} onChange={(e) => setFormData({ ...formData, contractSignatureLocation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
              </div>
            </div>

            {/* Section 2: Dates & Duration */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Dates & Duration
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium mb-1">Start Date</label>
                  <input type="date" value={formData.tenancyStartDate} onChange={(e) => setFormData({ ...formData, tenancyStartDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" value={formData.tenancyEndDate} onChange={(e) => setFormData({ ...formData, tenancyEndDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Duration</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Days</label>
                  <input type="number" value={formData.days} onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
              </div>
            </div>

            {/* Section 3: Lessor Info */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Lessor Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Lessor Name</label>
                  <input type="text" value={formData.lessorName} onChange={(e) => setFormData({ ...formData, lessorName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Nationality</label>
                  <input type="text" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">ID Type</label>
                  <input type="text" value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">ID No</label>
                  <input type="text" value={formData.idNo} onChange={(e) => setFormData({ ...formData, idNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Mobile No</label>
                  <input type="tel" value={formData.mobileNo} onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
              </div>
            </div>

            {/* Section 4: Tenant Info */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Tenant Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Tenant Name</label>
                  <input type="text" value={formData.tenantName} onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Nationality</label>
                  <input type="text" value={formData.tenantNationality} onChange={(e) => setFormData({ ...formData, tenantNationality: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">ID Type</label>
                  <input type="text" value={formData.tenantIdType} onChange={(e) => setFormData({ ...formData, tenantIdType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">ID No</label>
                  <input type="text" value={formData.tenantIdNo} onChange={(e) => setFormData({ ...formData, tenantIdNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Mobile No</label>
                  <input type="tel" value={formData.tenantMobileNo} onChange={(e) => setFormData({ ...formData, tenantMobileNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.tenantEmail} onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
              </div>
            </div>

            {/* Section 5: Financials */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Financial Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium mb-1">Property Value</label>
                  <input type="number" step="0.01" value={formData.propertyValue} onChange={(e) => setFormData({ ...formData, propertyValue: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Installments</label>
                  <input type="number" value={formData.installments} onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Due Amount</label>
                  <input type="number" step="0.01" value={formData.dueAmount} onChange={(e) => setFormData({ ...formData, dueAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Paid Amount</label>
                  <input type="number" step="0.01" value={formData.paidAmount} onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Not Paid Amount</label>
                  <input type="number" step="0.01" value={formData.notPaidAmount} onChange={(e) => setFormData({ ...formData, notPaidAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
                <div><label className="block text-sm font-medium mb-1">Due Period</label>
                  <input type="text" value={formData.duePeriod} onChange={(e) => setFormData({ ...formData, duePeriod: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isReadOnly} /></div>
              </div>
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-8 pt-4 border-t border-border">
              <button type="submit" disabled={loading} className="btn-primary px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50">
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Contract"}
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Contracts"
          columns={["Contract No", "Type", "Tenant", "Lessor", "Station Code"]}
          records={records.map(r => ({
            "Contract No": r.contract_no,
            "Type": r.contract_type || "N/A",
            "Tenant": r.tenant_name || "N/A",
            "Lessor": r.lessor_name || "N/A",
            "Station Code": r.station_code
          }))}
        />
      )}
    </div>
  );
}
