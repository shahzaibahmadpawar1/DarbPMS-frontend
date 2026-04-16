import { useState, useEffect, type ChangeEvent } from "react";
import { Save, List, PlusCircle, Eye, FileText, Send, Upload, Paperclip } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import { useLocation, useParams } from "react-router-dom";

export function ContractForm() {
  const { stationId } = useParams();
  const location = useLocation();
  const { accessMode, selectedStation } = useStation();
  const isReadOnly = accessMode === 'view-only';
  const taskId = new URLSearchParams(location.search).get("taskId") || "";

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(selectedStation);
  const [taskInitError, setTaskInitError] = useState("");
  const [taskStationCode, setTaskStationCode] = useState("");

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
    contractAttachmentUrl: "",
    contractAttachmentName: "",
    reviewStatus: "Draft",
    stationCode: "",
  });

  const applyContractRowToForm = (saved: any, fallbackStationCode: string) => {
    if (!saved?.id) return;
    setDraftId(saved.id);
    setFormData({
      contractNo: saved.contract_no || "",
      contractType: saved.contract_type || "",
      contractSignatureDate: saved.contract_signature_date ? String(saved.contract_signature_date).slice(0, 10) : "",
      contractSignatureLocation: saved.contract_signature_location || "",
      tenancyStartDate: saved.tenancy_start_date ? String(saved.tenancy_start_date).slice(0, 10) : "",
      tenancyEndDate: saved.tenancy_end_date ? String(saved.tenancy_end_date).slice(0, 10) : "",
      lessorName: saved.lessor_name || "",
      nationality: saved.nationality || "",
      idType: saved.id_type || "",
      idNo: saved.id_no || "",
      idCopy: saved.id_copy || "",
      mobileNo: saved.mobile_no || "",
      email: saved.email || "",
      tenantName: saved.tenant_name || "",
      tenantNationality: saved.tenant_nationality || "",
      tenantIdType: saved.tenant_id_type || "",
      tenantIdNo: saved.tenant_id_no || "",
      tenantIdCopy: saved.tenant_id_copy || "",
      tenantMobileNo: saved.tenant_mobile_no || "",
      tenantEmail: saved.tenant_email || "",
      duration: saved.duration || "",
      days: saved.days != null ? String(saved.days) : "",
      propertyValue: saved.property_value != null ? String(saved.property_value) : "",
      installments: saved.installments != null ? String(saved.installments) : "",
      dueDate: saved.due_date ? String(saved.due_date).slice(0, 10) : "",
      dueAmount: saved.due_amount != null ? String(saved.due_amount) : "",
      paidAmount: saved.paid_amount != null ? String(saved.paid_amount) : "",
      notPaidAmount: saved.not_paid_amount != null ? String(saved.not_paid_amount) : "",
      duePeriod: saved.due_period || "",
      contractAttachmentUrl: saved.contract_attachment_url || "",
      contractAttachmentName: saved.contract_attachment_name || "",
      reviewStatus: saved.review_status || (saved.is_submitted ? "Pending Review" : "Draft"),
      stationCode: saved.station_code || fallbackStationCode,
    });
  };

  const uploadAttachment = async (file: File) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("Please sign in again.");
      return null;
    }

    const formDataPayload = new FormData();
    formDataPayload.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/files/upload`, formDataPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      url: response.data?.data?.url || "",
      name: response.data?.data?.fileName || file.name,
    };
  };

  useEffect(() => {
    const hydrateForm = async () => {
      if (taskId) {
        return;
      }

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

        const response = await axios.get(`${API_BASE_URL}/contracts/latest-saved?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const saved = response.data?.data;
        if (taskId) return;
        if (!saved?.id) return;

        applyContractRowToForm(saved, stationCode);
      } catch (error) {
        console.error("Error loading latest saved contract:", error);
      }
    };

    void hydrateForm();
  }, [selectedStation, stationId, taskId]);

  useEffect(() => {
    const hydrateFromTask = async () => {
      if (!taskId) return;
      const token = localStorage.getItem("auth_token");
      if (!token) return;

      try {
        setLoading(true);
        setTaskInitError("");
        const response = await axios.post(
          `${API_BASE_URL}/contracts/from-task/${encodeURIComponent(taskId)}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const contract = response.data?.data;
        if (!contract?.id) return;

        const stationCode = contract.station_code || "";
        const routeStationCode = String(stationId || "").trim();
        if (routeStationCode && stationCode && routeStationCode !== stationCode) {
          setTaskInitError(`Station mismatch detected. Route station is ${routeStationCode} but task resolved to ${stationCode}.`);
          return;
        }

        setTaskStationCode(stationCode);
        applyContractRowToForm(contract, stationCode);
        setViewMode("form");
      } catch (error: any) {
        console.error("Error starting contract task:", error);
        const errorMsg = error.response?.data?.error || "Failed to open contract task";
        setTaskInitError(errorMsg);
        alert(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    void hydrateFromTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

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

  const persistContract = async (mode: 'save' | 'submit') => {
    if (formData.reviewStatus === 'Approved' || formData.reviewStatus === 'Pending Review') {
      alert("This contract is already under review or approved.");
      return;
    }

    if (mode === 'submit') setSubmitting(true); else setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert("Please sign in again.");
        return;
      }

      // If this form was opened from a task, ensure we have a draft contract row first.
      // This avoids falling back to POST /contracts (which can 403 due to station department scope).
      let effectiveDraftId = draftId;
      if (taskId && !effectiveDraftId) {
        const bootstrap = await axios.post(
          `${API_BASE_URL}/contracts/from-task/${encodeURIComponent(taskId)}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const bootstrapped = bootstrap.data?.data;
        if (bootstrapped?.id) {
          effectiveDraftId = bootstrapped.id;
          setTaskStationCode(String(bootstrapped.station_code || "").trim());
          applyContractRowToForm(bootstrapped, bootstrapped.station_code || formData.stationCode || "");
        } else {
          alert("Failed to initialize contract draft from task.");
          return;
        }
      }

      if (taskId && taskStationCode && String(formData.stationCode || "").trim() !== taskStationCode) {
        alert("Station code is locked for task-based contracts and cannot be changed.");
        return;
      }

      if (mode === 'submit' && !formData.contractAttachmentUrl) {
        alert("Please attach the contract file before submitting.");
        return;
      }

      const payload = { ...formData, submit: mode === 'submit' };
      const response = effectiveDraftId
        ? await axios.put(`${API_BASE_URL}/contracts/${effectiveDraftId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
        : await axios.post(`${API_BASE_URL}/contracts`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.data?.id) {
        setDraftId(response.data.data.id);
      }

      if (mode === 'submit') {
        alert("Contract submitted successfully!");
      } else {
        alert("Contract saved successfully! You can continue later.");
      }

      fetchRecords();
      setViewMode('records');
      setFormData((prev) => ({ ...prev, reviewStatus: mode === 'submit' ? 'Pending Review' : prev.reviewStatus }));
    } catch (error: any) {
      console.error(`Error during contract ${mode}:`, error);
      const errorMsg = error.response?.data?.error || `Failed to ${mode} contract`;
      const details = error.response?.data?.details ? `\nDetails: ${error.response.data.details}` : "";
      alert(`${errorMsg}${details}`);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const isLocked = isReadOnly || formData.reviewStatus === 'Pending Review' || formData.reviewStatus === 'Approved';

  const handleAttachmentChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingAttachment(true);
      const uploaded = await uploadAttachment(file);
      if (!uploaded) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        contractAttachmentUrl: uploaded.url,
        contractAttachmentName: uploaded.name,
      }));
    } catch (error: any) {
      console.error('Error uploading contract attachment:', error);
      alert(error.response?.data?.error || error.message || 'Failed to upload attachment');
    } finally {
      setUploadingAttachment(false);
      event.target.value = '';
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
        <form onSubmit={(e) => e.preventDefault()} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {taskInitError && (
            <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {taskInitError}
            </div>
          )}
          <div className="space-y-8">
            {/* Section 1: Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Basic Info
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-sm font-medium mb-1">Contract No *</label>
                  <input type="text" value={formData.contractNo} onChange={(e) => setFormData({ ...formData, contractNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" required disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Contract Type</label>
                  <input type="text" value={formData.contractType} onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Station Code *</label>
                  <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" required disabled={isLocked || !!selectedStation || Boolean(taskId)} /></div>
                <div><label className="block text-sm font-medium mb-1">Signature Date</label>
                  <input type="date" value={formData.contractSignatureDate} onChange={(e) => setFormData({ ...formData, contractSignatureDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Signature Location</label>
                  <input type="text" value={formData.contractSignatureLocation} onChange={(e) => setFormData({ ...formData, contractSignatureLocation: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
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
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">End Date</label>
                  <input type="date" value={formData.tenancyEndDate} onChange={(e) => setFormData({ ...formData, tenancyEndDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Duration</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Days</label>
                  <input type="number" value={formData.days} onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
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
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Nationality</label>
                  <input type="text" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">ID Type</label>
                  <input type="text" value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">ID No</label>
                  <input type="text" value={formData.idNo} onChange={(e) => setFormData({ ...formData, idNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Mobile No</label>
                  <input type="tel" value={formData.mobileNo} onChange={(e) => setFormData({ ...formData, mobileNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
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
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Nationality</label>
                  <input type="text" value={formData.tenantNationality} onChange={(e) => setFormData({ ...formData, tenantNationality: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">ID Type</label>
                  <input type="text" value={formData.tenantIdType} onChange={(e) => setFormData({ ...formData, tenantIdType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">ID No</label>
                  <input type="text" value={formData.tenantIdNo} onChange={(e) => setFormData({ ...formData, tenantIdNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Mobile No</label>
                  <input type="tel" value={formData.tenantMobileNo} onChange={(e) => setFormData({ ...formData, tenantMobileNo: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.tenantEmail} onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
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
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Installments</label>
                  <input type="number" value={formData.installments} onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Due Date</label>
                  <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Due Amount</label>
                  <input type="number" step="0.01" value={formData.dueAmount} onChange={(e) => setFormData({ ...formData, dueAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Paid Amount</label>
                  <input type="number" step="0.01" value={formData.paidAmount} onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Not Paid Amount</label>
                  <input type="number" step="0.01" value={formData.notPaidAmount} onChange={(e) => setFormData({ ...formData, notPaidAmount: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
                <div><label className="block text-sm font-medium mb-1">Due Period</label>
                  <input type="text" value={formData.duePeriod} onChange={(e) => setFormData({ ...formData, duePeriod: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-background" disabled={isLocked} /></div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Paperclip className="w-5 h-5" /> Contract Attachment
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Attachment File</label>
                  <label className={`w-full px-3 py-3 border rounded-lg bg-background flex items-center justify-between gap-3 ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
                    <span className="text-sm text-muted-foreground truncate">
                      {formData.contractAttachmentName || 'Choose contract file'}
                    </span>
                    <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                      <Upload className="w-4 h-4" /> {uploadingAttachment ? 'Uploading...' : 'Upload'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
                      onChange={handleAttachmentChange}
                      className="hidden"
                      disabled={isLocked || uploadingAttachment}
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Current Attachment</label>
                  <div className="w-full px-3 py-3 border rounded-lg bg-background min-h-[48px] flex items-center">
                    {formData.contractAttachmentUrl ? (
                      <a href={formData.contractAttachmentUrl} target="_blank" rel="noreferrer" className="text-primary underline text-sm break-all">
                        Open attachment
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">No attachment uploaded yet</span>
                    )}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Review Status</label>
                  <div className="w-full px-3 py-3 border rounded-lg bg-background text-sm font-semibold">
                    {formData.reviewStatus}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isLocked && (
            <div className="flex justify-end mt-8 pt-4 border-t border-border gap-3">
              <button type="button" onClick={() => void persistContract('save')} disabled={loading || submitting} className="border border-border px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50">
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Contract"}
              </button>
              <button type="button" onClick={() => void persistContract('submit')} disabled={loading || submitting} className="btn-primary px-8 py-3 rounded-lg flex items-center gap-2 shadow-lg disabled:opacity-50">
                <Send className="w-5 h-5" />
                {submitting ? "Submitting..." : "Submit Contract"}
              </button>
            </div>
          )}
          {isLocked && (
            <div className="flex justify-end mt-8 pt-4 border-t border-border text-sm text-muted-foreground">
              This contract is locked while it is under review or after approval.
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Contracts"
          columns={["Contract No", "Type", "Tenant", "Lessor", "Station Code", "Status"]}
          records={records.map(r => ({
            "Contract No": r.contract_no,
            "Type": r.contract_type || "N/A",
            "Tenant": r.tenant_name || "N/A",
            "Lessor": r.lessor_name || "N/A",
            "Station Code": r.station_code,
            "Status": r.review_status || (r.is_submitted ? "Pending Review" : "Draft")
          }))}
        />
      )}
    </div>
  );
}
