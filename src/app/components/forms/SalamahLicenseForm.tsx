import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function SalamahLicenseForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    licenseNumber: "", issuanceDate: "", expiryDate: "", numberOfDays: "", licenseStatus: "",
    investorName: "", moiNumber: "", nationalAddress: "", commercialRegister: "",
    facilityName: "", branchName: "", area: "", city: "", district: "",
    street: "", landNumber: "", shopSpace: "", stationCode: "", officeCode: ""
  });

  const mockRecords = [
    { no: "SAL-9981", facility: "Darb Al Sultan", investor: "Ahmed Mansour", expiry: "2025-12-31", status: "Active" },
    { no: "SAL-9985", facility: "Jeddah North", investor: "Sarah Al-Otaibi", expiry: "2025-11-20", status: "Active" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Salamah Civil Defense License</h1>
          <p className="text-gray-600 mt-2">Manage safety and fire protection compliance certificates</p>
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
        <form onSubmit={(e) => { e.preventDefault(); alert("Salamah License saved!"); }} className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input type={key.includes('Date') ? 'date' : key.includes('Number') || key.includes('Days') || key.includes('Space') ? 'number' : 'text'}
                  value={value} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-5 h-5" /> Save Salamah License
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Salamah Licenses"
          columns={["License No", "Facility Name", "Investor", "Expiry Date", "Status"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}






