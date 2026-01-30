import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function DeedInformationForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    deedNumber: "", deedDate: "", deedIssuedBy: "", realEstateUnitNumber: "", area: "",
    nationality: "", ownershipPercentage: "", address: "", idType: "", idDate: "",
    landNumber: "", blockNumber: "", district: "", city: "", unitType: "", statusCode: "", stationCode: ""
  });

  const mockRecords = [
    { no: "DEED-50521", city: "Riyadh", area: "2,500 sqm", owner: "Ahmed Mansour", date: "2023-11-05" },
    { no: "DEED-99102", city: "Jeddah", area: "1,800 sqm", owner: "Sarah Al-Otaibi", date: "2024-01-20" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Deed Information saved!");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Deed Information (Land Ownership)</h1>
          <p className="text-gray-600 mt-2">Manage land registry and property ownership deeds</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Deed Number (PK) *</label>
              <input type="text" value={formData.deedNumber} onChange={(e) => setFormData({ ...formData, deedNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Deed Date</label>
              <input type="date" value={formData.deedDate} onChange={(e) => setFormData({ ...formData, deedDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Deed Issued By</label>
              <input type="text" value={formData.deedIssuedBy} onChange={(e) => setFormData({ ...formData, deedIssuedBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Real Estate Unit Number</label>
              <input type="text" value={formData.realEstateUnitNumber} onChange={(e) => setFormData({ ...formData, realEstateUnitNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Area (sqm)</label>
              <input type="number" value={formData.area} onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
              <input type="text" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Ownership Percentage (%)</label>
              <input type="number" value={formData.ownershipPercentage} onChange={(e) => setFormData({ ...formData, ownershipPercentage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ID Type</label>
              <input type="text" value={formData.idType} onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">ID Date</label>
              <input type="date" value={formData.idDate} onChange={(e) => setFormData({ ...formData, idDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Land Number</label>
              <input type="text" value={formData.landNumber} onChange={(e) => setFormData({ ...formData, landNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Block Number</label>
              <input type="text" value={formData.blockNumber} onChange={(e) => setFormData({ ...formData, blockNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Unit Type</label>
              <input type="text" value={formData.unitType} onChange={(e) => setFormData({ ...formData, unitType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Status Code</label>
              <input type="text" value={formData.statusCode} onChange={(e) => setFormData({ ...formData, statusCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Station Code (FK)</label>
              <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-[#ff6b35] hover:bg-[#ff8c61] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-5 h-5" /> Save Deed Information
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Deed Information"
          columns={["Deed #", "City", "Area", "Owner Name", "Date"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
