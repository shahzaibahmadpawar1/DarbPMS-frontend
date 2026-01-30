import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function OwnerInformationForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    ownerId: "",
    ownerName: "",
    idIssueDate: "",
    idIssuePlace: "",
    ownerMobile: "",
    ownerAddress: "",
    ownerEmail: "",
    stationTypeCode: "",
    stationCode: "",
  });

  const mockRecords = [
    { id: "1023948572", name: "Ahmed Mansour", mobile: "+966 50 123 4567", email: "ahmed@example.com", station: "ST-201" },
    { id: "1092837465", name: "Sarah Al-Otaibi", mobile: "+966 55 987 6543", email: "sarah@example.com", station: "ST-202" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Owner Information:", formData);
    alert("Owner Information saved successfully!");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Owner Information</h1>
          <p className="text-gray-600 mt-2">Manage station owner details and contact information</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner ID/National ID (PK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Issue Date</label>
              <input
                type="date"
                value={formData.idIssueDate}
                onChange={(e) => setFormData({ ...formData, idIssueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Issue Place</label>
              <input
                type="text"
                value={formData.idIssuePlace}
                onChange={(e) => setFormData({ ...formData, idIssuePlace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Mobile</label>
              <input
                type="tel"
                value={formData.ownerMobile}
                onChange={(e) => setFormData({ ...formData, ownerMobile: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Email</label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner Address</label>
              <textarea
                value={formData.ownerAddress}
                onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Station Type Code (FK)</label>
              <select
                value={formData.stationTypeCode}
                onChange={(e) => setFormData({ ...formData, stationTypeCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
              >
                <option value="">Select Type</option>
                <option value="1">Owned Station</option>
                <option value="2">Rented Station</option>
                <option value="3">Operation</option>
                <option value="4">Franchise</option>
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
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-[#ff6b35] hover:bg-[#ff8c61] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Owner Information
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Owner Information"
          columns={["ID/National ID", "Name", "Mobile", "Email", "Station Code"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
