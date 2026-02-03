import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function BuildingPermitForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    permitNumber: isReadOnly ? "BP- Riyadh-101-2024" : "",
    licenseDate: isReadOnly ? "2024-01-15" : "",
    expiryDate: isReadOnly ? "2027-01-15" : "",
    licenseType: isReadOnly ? "Construction Permit" : "",
    organizationChartNumber: isReadOnly ? "ORG-7721" : "",
    constructionType: isReadOnly ? "Steel & Concrete" : "",
    urbanArea: isReadOnly ? "Riyadh Municipal Area" : "",
    landArea: isReadOnly ? "5250" : "",
    wallsPerimeter: isReadOnly ? "320" : "",
    borderNorth: isReadOnly ? "Main Street" : "",
    borderEast: isReadOnly ? "Neighbor Land" : "",
    borderSouth: isReadOnly ? "Service Road" : "",
    borderWest: isReadOnly ? "Empty Plot" : "",
    constructionComponents: isReadOnly ? "Shop, Mosque, Utilities" : "",
    numberOfUnits: isReadOnly ? "3" : "",
    stationStatusCode: isReadOnly ? "under-construction" : "",
    stationCode: isReadOnly ? "N101" : "",
    officeCode: isReadOnly ? "OFF-201" : ""
  });

  const mockRecords = [
    { no: "BP-552", type: "New Construction", station: "ST-201", date: "2024-01-15", expiry: "2026-01-15" },
    { no: "BP-610", type: "Renovation", station: "ST-203", date: "2023-11-20", expiry: "2025-11-20" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Building Permit (Municipality)</h1>
          <p className="text-gray-600 mt-2">Manage municipal construction and building permits</p>
        </div>

        {!isReadOnly && (
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
        )}

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={(e) => { e.preventDefault(); alert("Building Permit saved!"); }} className="bg-white rounded-xl shadow-xl p-8 vibrant-glow border-t-4 border-violet-600 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input type={key.includes('Date') ? 'date' : key.includes('Number') || key.includes('Area') ? 'number' : 'text'}
                  value={value} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                />
              </div>
            ))}
          </div>
          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button type="submit" className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
                <Save className="w-5 h-5" /> Save Building Permit
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Building Permits"
          columns={["Permit No", "Type", "Station", "Issue Date", "Expiry Date"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
