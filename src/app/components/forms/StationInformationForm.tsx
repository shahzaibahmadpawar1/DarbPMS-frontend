import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function StationInformationForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    stationCode: "",
    stationName: "",
    areaRegion: "",
    city: "",
    sector: "",
    district: "",
    street: "",
    geographicLocation: "",
    stationSpace: "",
    canopySpace: "",
    frontYardsSpace: "",
    throwbackYardsSpace: "",
    mosqueSpace: "",
    restRoomSpace: "",
    residentLaborSpace: "",
    officeSpace: "",
    rentalUnitsSpace: "",
    numberOfRentalUnits: "",
    numberOfUndergroundTanks: "",
    stationTypeCode: "",
    stationStatusCode: "",
  });

  const mockRecords = [
    { code: "ST-201", name: "Darb Al Sultan", city: "Riyadh", type: "Owned", status: "Active" },
    { code: "ST-202", name: "Jeddah Central", city: "Jeddah", type: "Rented", status: "Active" },
    { code: "ST-203", name: "Dammam East", city: "Dammam", type: "Operation", status: "Construction" },
    { code: "ST-204", name: "Medina Oasis", city: "Medina", type: "Franchise", status: "Planning" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Station Information:", formData);
    alert("Station Information saved successfully!");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Station Information</h1>
          <p className="text-gray-600 mt-2">The core record for fuel station management</p>
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
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station Code (PK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.stationCode}
                  onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.stationName}
                  onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Station Type Code (FK)
                </label>
                <select
                  value={formData.stationTypeCode}
                  onChange={(e) => setFormData({ ...formData, stationTypeCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                >
                  <option value="">Select Type</option>
                  <option value="1">Owned Station</option>
                  <option value="2">Rented Station</option>
                  <option value="3">Operation</option>
                  <option value="4">Franchise</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Area/Region</label>
                <input
                  type="text"
                  value={formData.areaRegion}
                  onChange={(e) => setFormData({ ...formData, areaRegion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                <input
                  type="text"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Geographic Location (Google Maps URL)</label>
                <input
                  type="url"
                  value={formData.geographicLocation}
                  onChange={(e) => setFormData({ ...formData, geographicLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  placeholder="https://maps.google.com/..."
                />
              </div>
            </div>
          </div>

          {/* Space Specifications */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Space Specifications (sqm)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Space (Total sqm)</label>
                <input
                  type="number"
                  value={formData.stationSpace}
                  onChange={(e) => setFormData({ ...formData, stationSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Canopy Space</label>
                <input
                  type="number"
                  value={formData.canopySpace}
                  onChange={(e) => setFormData({ ...formData, canopySpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Front Yards Space</label>
                <input
                  type="number"
                  value={formData.frontYardsSpace}
                  onChange={(e) => setFormData({ ...formData, frontYardsSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Throwback Yards Space</label>
                <input
                  type="number"
                  value={formData.throwbackYardsSpace}
                  onChange={(e) => setFormData({ ...formData, throwbackYardsSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mosque Space</label>
                <input
                  type="number"
                  value={formData.mosqueSpace}
                  onChange={(e) => setFormData({ ...formData, mosqueSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rest Room Space</label>
                <input
                  type="number"
                  value={formData.restRoomSpace}
                  onChange={(e) => setFormData({ ...formData, restRoomSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resident/Labor Space</label>
                <input
                  type="number"
                  value={formData.residentLaborSpace}
                  onChange={(e) => setFormData({ ...formData, residentLaborSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Space</label>
                <input
                  type="number"
                  value={formData.officeSpace}
                  onChange={(e) => setFormData({ ...formData, officeSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rental Units Space</label>
                <input
                  type="number"
                  value={formData.rentalUnitsSpace}
                  onChange={(e) => setFormData({ ...formData, rentalUnitsSpace: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#020713] mb-4 border-b border-[#D2C29C] pb-2">
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Rental Units</label>
                <input
                  type="number"
                  value={formData.numberOfRentalUnits}
                  onChange={(e) => setFormData({ ...formData, numberOfRentalUnits: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Number of Underground Tanks</label>
                <input
                  type="number"
                  value={formData.numberOfUndergroundTanks}
                  onChange={(e) => setFormData({ ...formData, numberOfUndergroundTanks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Station Status Code (FK)</label>
                <select
                  value={formData.stationStatusCode}
                  onChange={(e) => setFormData({ ...formData, stationStatusCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                  <option value="3">Under Construction</option>
                  <option value="4">Under Development</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#6366f1] hover:bg-[#818cf8] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Station Information
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Station Information"
          columns={["Code", "Name", "City", "Type", "Status"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}






