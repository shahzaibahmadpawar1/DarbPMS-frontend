import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function CommercialLicenseForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    licenseNumber: isReadOnly ? "COM-N101-2024" : "",
    paymentDueDate: isReadOnly ? "2024-12-31" : "",
    issuanceDate: isReadOnly ? "2024-01-01" : "",
    expiryDate: isReadOnly ? "2025-01-01" : "",
    numberOfDays: isReadOnly ? "365" : "",
    licenseStatus: isReadOnly ? "active" : "",
    ownerName: isReadOnly ? "Ahmed bin Abdullah Al-Mansour" : "",
    ownerId: isReadOnly ? "1023948572" : "",
    isicClassification: isReadOnly ? "Fuel Retail & Services" : "",
    municipality: isReadOnly ? "Riyadh Municipality" : "",
    subMunicipality: isReadOnly ? "Al-Malqa Sub-Municipality" : "",
    district: isReadOnly ? "Al-Malqa" : "",
    street: isReadOnly ? "King Fahd Road" : "",
    totalSpace: isReadOnly ? "5250" : "",
    signageSpace: isReadOnly ? "120" : "",
    stationCode: isReadOnly ? "N101" : "",
  });

  const mockRecords = [
    { no: "COM-88210", owner: "Ahmed Mansour", municipality: "Riyadh", status: "Active", expiry: "2025-10-12" },
    { no: "COM-99021", owner: "Sarah Al-Otaibi", municipality: "Jeddah", status: "Active", expiry: "2025-05-18" },
    { no: "COM-77332", owner: "Darb Co.", municipality: "Dammam", status: "Pending", expiry: "2024-12-01" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Commercial License:", formData);
    alert("Commercial License saved successfully!");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Commercial License</h1>
          <p className="text-gray-600 mt-2">Manage commercial licensing and compliance certificates</p>
        </div>

        {!isReadOnly && (
          <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                ? 'bg-white text-[#f97316] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Entry</span>
            </button>
            <button
              onClick={() => setViewMode('records')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                ? 'bg-white text-[#f97316] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <List className="w-4 h-4" />
              <span>View Records</span>
            </button>
          </div>
        )}

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              License Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number (PK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Due Date</label>
                <input
                  type="date"
                  value={formData.paymentDueDate}
                  onChange={(e) => setFormData({ ...formData, paymentDueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issuance Date</label>
                <input
                  type="date"
                  value={formData.issuanceDate}
                  onChange={(e) => setFormData({ ...formData, issuanceDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days (Calculated)</label>
                <input
                  type="number"
                  value={formData.numberOfDays}
                  onChange={(e) => setFormData({ ...formData, numberOfDays: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  readOnly
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Status</label>
                <select
                  value={formData.licenseStatus}
                  onChange={(e) => setFormData({ ...formData, licenseStatus: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending Renewal</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Owner Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner ID</label>
                <input
                  type="text"
                  value={formData.ownerId}
                  onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ISIC Classification</label>
                <input
                  type="text"
                  value={formData.isicClassification}
                  onChange={(e) => setFormData({ ...formData, isicClassification: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Location & Space Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
                <input
                  type="text"
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Municipality</label>
                <input
                  type="text"
                  value={formData.subMunicipality}
                  onChange={(e) => setFormData({ ...formData, subMunicipality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Space (sqm)</label>
                <input
                  type="number"
                  value={formData.totalSpace}
                  onChange={(e) => setFormData({ ...formData, totalSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signage Space (sqm)</label>
                <input
                  type="number"
                  value={formData.signageSpace}
                  onChange={(e) => setFormData({ ...formData, signageSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Code (FK)</label>
                <input
                  type="text"
                  value={formData.stationCode}
                  onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-[#f97316] hover:bg-[#fb923c] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Commercial License
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Commercial Licenses"
          columns={["License No", "Owner Name", "Municipality", "Status", "Expiry Date"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
