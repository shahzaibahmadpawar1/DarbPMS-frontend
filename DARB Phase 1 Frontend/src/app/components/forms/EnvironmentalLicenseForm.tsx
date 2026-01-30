import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function EnvironmentalLicenseForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    issuanceNumber: "", issuanceDate: "", expiryDate: "", numberOfDays: "", licenseStatus: "",
    facilityName: "", ownerName: "", address: "", facilityNumber: "", geographicLocation: "",
    commercialRegister: "", workScope: "", businessType: "", orderNumber: "", orderDate: "",
    phone: "", fax: "", mailbox: "", city: "", issuedBy: "", stationCode: "", officeCode: ""
  });

  const mockRecords = [
    { no: "ENV-2024-88", facility: "Darb Riyadh", city: "Riyadh", expiry: "2025-06-30", status: "Active" },
    { no: "ENV-2024-92", facility: "Jeddah Station", city: "Jeddah", expiry: "2025-08-15", status: "Active" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Environmental License</h1>
          <p className="text-gray-600 mt-2">Manage environmental compliance and impact assessments</p>
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
        <form onSubmit={(e) => { e.preventDefault(); alert("Environmental License saved!"); }} className="bg-white rounded-lg shadow-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input type={key.includes('Date') ? 'date' : key.includes('Days') ? 'number' : 'text'}
                  value={value} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" />
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-[#ff6b35] hover:bg-[#ff8c61] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-5 h-5" /> Save Environmental License
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Environmental Licenses"
          columns={["Issuance No", "Facility Name", "City", "Expiry Date", "Status"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
