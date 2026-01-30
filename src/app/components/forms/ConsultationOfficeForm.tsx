import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function ConsultationOfficeForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    officeCode: "", officeName: "", licenseNumber: "", businessType: "",
    address: "", email: "", mobileNumber: "", contactPersonName: ""
  });

  const mockRecords = [
    { code: "OFF-201", name: "Studio Riyadh Engineering", license: "L-90031", contact: "Eng. Fahad", phone: "+966 50 111 2222" },
    { code: "OFF-205", name: "Jeddah Designs Group", license: "L-88210", contact: "Eng. Mona", phone: "+966 55 333 4444" },
  ];

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert("Consultation Office saved!"); };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Consultation Office</h1>
          <p className="text-gray-600 mt-2">Manage partner engineering firms and consulting offices</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setViewMode('form')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                ? 'bg-white text-[#6366f1] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Entry</span>
          </button>
          <button
            onClick={() => setViewMode('records')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                ? 'bg-white text-[#6366f1] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <List className="w-4 h-4" />
            <span>View Records</span>
          </button>
        </div>
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Office Code (PK) *</label>
              <input type="text" value={formData.officeCode} onChange={(e) => setFormData({ ...formData, officeCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Office Name</label>
              <input type="text" value={formData.officeName} onChange={(e) => setFormData({ ...formData, officeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
              <input type="text" value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
              <input type="text" value={formData.businessType} onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name</label>
              <input type="text" value={formData.contactPersonName} onChange={(e) => setFormData({ ...formData, contactPersonName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-5 h-5" /> Save Consultation Office
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Consultation Offices"
          columns={["Office Code", "Office Name", "License #", "Contact Person", "Phone"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}






