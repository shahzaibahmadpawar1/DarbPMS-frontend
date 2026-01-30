import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function ContractForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    contractNumber: "",
    contractType: "",
    signatureDate: "",
    signatureLocation: "",
    tenancyStartDate: "",
    tenancyEndDate: "",
    lessorName: "",
    lessorNationality: "",
    lessorIdType: "",
    lessorIdNo: "",
    lessorMobile: "",
    lessorEmail: "",
    tenantName: "",
    tenantNationality: "",
    tenantIdNo: "",
    tenantMobile: "",
    tenantEmail: "",
    durationYears: "",
    durationDays: "",
    contractValue: "",
    numberOfInstallments: "",
    dueDate: "",
    dueAmount: "",
    paidAmount: "",
    unpaidAmount: "",
    duePeriod: "",
    stationCode: "",
  });

  const mockRecords = [
    { no: "CN-8821", type: "Lease", tenant: "DARB Co.", station: "ST-201", value: "150,000 SAR" },
    { no: "CN-9902", type: "Rent", tenant: "Global Fuel", station: "ST-204", value: "85,000 SAR" },
    { no: "CN-7733", type: "Sublease", tenant: "QuickStop", station: "ST-202", value: "120,000 SAR" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contract Information:", formData);
    alert("Contract saved successfully!");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Contract Management</h1>
          <p className="text-gray-600 mt-2">Lease and rent agreement details</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('form')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                ? 'bg-white text-[#ff6b35] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Entry</span>
          </button>
          <button
            onClick={() => setViewMode('records')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                ? 'bg-white text-[#ff6b35] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <List className="w-4 h-4" />
            <span>View Records</span>
          </button>
        </div>
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Contract Basic Info */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Contract Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Number (PK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contractNumber}
                  onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Type</label>
                <select
                  value={formData.contractType}
                  onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                >
                  <option value="">Select Type</option>
                  <option value="lease">Lease</option>
                  <option value="rent">Rent</option>
                  <option value="sublease">Sublease</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Code (FK)</label>
                <input
                  type="text"
                  value={formData.stationCode}
                  onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signature Date</label>
                <input
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) => setFormData({ ...formData, signatureDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Signature Location</label>
                <input
                  type="text"
                  value={formData.signatureLocation}
                  onChange={(e) => setFormData({ ...formData, signatureLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenancy Start Date</label>
                <input
                  type="date"
                  value={formData.tenancyStartDate}
                  onChange={(e) => setFormData({ ...formData, tenancyStartDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenancy End Date</label>
                <input
                  type="date"
                  value={formData.tenancyEndDate}
                  onChange={(e) => setFormData({ ...formData, tenancyEndDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>
          </div>

          {/* Lessor Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Lessor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lessor Name</label>
                <input
                  type="text"
                  value={formData.lessorName}
                  onChange={(e) => setFormData({ ...formData, lessorName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lessor Nationality</label>
                <input
                  type="text"
                  value={formData.lessorNationality}
                  onChange={(e) => setFormData({ ...formData, lessorNationality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lessor ID Type</label>
                <select
                  value={formData.lessorIdType}
                  onChange={(e) => setFormData({ ...formData, lessorIdType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                >
                  <option value="">Select ID Type</option>
                  <option value="national">National ID</option>
                  <option value="passport">Passport</option>
                  <option value="commercial">Commercial Registration</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lessor ID No</label>
                <input
                  type="text"
                  value={formData.lessorIdNo}
                  onChange={(e) => setFormData({ ...formData, lessorIdNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lessor Mobile</label>
                <input
                  type="tel"
                  value={formData.lessorMobile}
                  onChange={(e) => setFormData({ ...formData, lessorMobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lessor Email</label>
                <input
                  type="email"
                  value={formData.lessorEmail}
                  onChange={(e) => setFormData({ ...formData, lessorEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>
          </div>

          {/* Tenant Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Tenant Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Name</label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Nationality</label>
                <input
                  type="text"
                  value={formData.tenantNationality}
                  onChange={(e) => setFormData({ ...formData, tenantNationality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant ID No</label>
                <input
                  type="text"
                  value={formData.tenantIdNo}
                  onChange={(e) => setFormData({ ...formData, tenantIdNo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Mobile</label>
                <input
                  type="tel"
                  value={formData.tenantMobile}
                  onChange={(e) => setFormData({ ...formData, tenantMobile: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenant Email</label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Financial Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
                <input
                  type="number"
                  value={formData.durationYears}
                  onChange={(e) => setFormData({ ...formData, durationYears: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Value (SAR)</label>
                <input
                  type="number"
                  value={formData.contractValue}
                  onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Installments</label>
                <input
                  type="number"
                  value={formData.numberOfInstallments}
                  onChange={(e) => setFormData({ ...formData, numberOfInstallments: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Amount (SAR)</label>
                <input
                  type="number"
                  value={formData.dueAmount}
                  onChange={(e) => setFormData({ ...formData, dueAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (SAR)</label>
                <input
                  type="number"
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unpaid Amount (SAR)</label>
                <input
                  type="number"
                  value={formData.unpaidAmount}
                  onChange={(e) => setFormData({ ...formData, unpaidAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Period</label>
                <input
                  type="text"
                  value={formData.duePeriod}
                  onChange={(e) => setFormData({ ...formData, duePeriod: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#ff6b35] hover:bg-[#ff8c61] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Contract
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Contract Management"
          columns={["Contract No", "Type", "Tenant", "Station", "Value"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
