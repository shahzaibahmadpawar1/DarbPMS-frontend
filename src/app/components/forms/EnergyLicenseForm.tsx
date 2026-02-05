import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function EnergyLicenseForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    licenseNumber: isReadOnly ? "EN-2024-00129" : "",
    issuanceDate: isReadOnly ? "2024-01-10" : "",
    expiryDate: isReadOnly ? "2025-01-10" : "",
    numberOfDays: isReadOnly ? "180" : "",
    licenseStatus: isReadOnly ? "active" : "",
    stationCode: isReadOnly ? "N101" : "",
    officeCode: isReadOnly ? "OFF-204" : ""
  });

  const mockRecords = [
    { no: "EN-2024-001", station: "ST-201", issueDate: "2024-01-10", expiryDate: "2025-01-10", status: "Active" },
    { no: "EN-2024-005", station: "ST-204", issueDate: "2023-12-01", expiryDate: "2024-12-01", status: "Active" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Energy License</h1>
          <p className="text-gray-600 mt-2">Manage energy and utility operation licenses</p>
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
        <form onSubmit={(e) => { e.preventDefault(); alert("Energy License saved!"); }} className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type={key.includes('Date') ? 'date' : key.includes('Days') ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f97316] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
            ))}
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button type="submit" className="bg-[#f97316] hover:bg-[#fb923c] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <Save className="w-5 h-5" /> Save Energy License
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Energy Licenses"
          columns={["License No", "Station", "Issue Date", "Expiry Date", "Status"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
