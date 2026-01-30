import { useState } from "react";
import { Save, Upload, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function ArchitecturalDesignForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    designCode: "", stationSpace: "", canopySpace: "", frontYardsSpace: "", throwbackYardsSpace: "",
    mosqueSpace: "", restRoomSpace: "", residentSpace: "", officeSpace: "", rentalUnitsSpace: "",
    numberOfRentalUnits: "", numberOfTanks: "", diagramCode: "", designStatusCode: "",
    deedNo: "", stationCode: "", officeCode: ""
  });

  const mockRecords = [
    { code: "DSGN-2024-01", station: "ST-201", status: "Approved", office: "Studio Riyadh", date: "2024-01-15" },
    { code: "DSGN-2024-03", station: "ST-203", status: "In Review", office: "Jeddah Arch", date: "2024-02-10" },
  ];

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); alert("Architectural Design saved!"); };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Architectural Design</h1>
          <p className="text-gray-600 mt-2">Manage station blueprints and architectural specifications</p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Design Code (PK) *</label>
              <input type="text" value={formData.designCode} onChange={(e) => setFormData({ ...formData, designCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Station Space</label>
              <input type="number" value={formData.stationSpace} onChange={(e) => setFormData({ ...formData, stationSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Canopy Space</label>
              <input type="number" value={formData.canopySpace} onChange={(e) => setFormData({ ...formData, canopySpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Front Yards Space</label>
              <input type="number" value={formData.frontYardsSpace} onChange={(e) => setFormData({ ...formData, frontYardsSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Throwback Yards Space</label>
              <input type="number" value={formData.throwbackYardsSpace} onChange={(e) => setFormData({ ...formData, throwbackYardsSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Mosque Space</label>
              <input type="number" value={formData.mosqueSpace} onChange={(e) => setFormData({ ...formData, mosqueSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rest Room Space</label>
              <input type="number" value={formData.restRoomSpace} onChange={(e) => setFormData({ ...formData, restRoomSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Resident Space</label>
              <input type="number" value={formData.residentSpace} onChange={(e) => setFormData({ ...formData, residentSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Office Space</label>
              <input type="number" value={formData.officeSpace} onChange={(e) => setFormData({ ...formData, officeSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Rental Units Space</label>
              <input type="number" value={formData.rentalUnitsSpace} onChange={(e) => setFormData({ ...formData, rentalUnitsSpace: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Number of Rental Units</label>
              <input type="number" value={formData.numberOfRentalUnits} onChange={(e) => setFormData({ ...formData, numberOfRentalUnits: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Number of Tanks</label>
              <input type="number" value={formData.numberOfTanks} onChange={(e) => setFormData({ ...formData, numberOfTanks: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Attached Document</label>
              <div className="flex items-center gap-2">
                <input type="file" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" />
                <Upload className="w-5 h-5 text-gray-500" />
              </div>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Diagram Code</label>
              <input type="text" value={formData.diagramCode} onChange={(e) => setFormData({ ...formData, diagramCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Design Status Code</label>
              <input type="text" value={formData.designStatusCode} onChange={(e) => setFormData({ ...formData, designStatusCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Deed No (FK)</label>
              <input type="text" value={formData.deedNo} onChange={(e) => setFormData({ ...formData, deedNo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Station Code (FK)</label>
              <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Office Code (FK)</label>
              <input type="text" value={formData.officeCode} onChange={(e) => setFormData({ ...formData, officeCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]" /></div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-5 h-5" /> Save Architectural Design
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Architectural Designs"
          columns={["Design Code", "Station", "Status", "Office", "Date"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}






