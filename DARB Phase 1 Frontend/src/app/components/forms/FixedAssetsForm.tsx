import { useState } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";

export function FixedAssetsForm() {
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    assetCode: "", assetName: "", assetGroup: "", location: "", purchaseAmount: "",
    vendorName: "", depreciationAmount: "", remainingBalance: "", assetOwner: "",
    costCenter: "", stationCode: ""
  });

  const mockRecords = [
    { code: "AST-882", name: "High-Flow Fuel Pump", group: "Equipment", location: "Riyadh Station", value: "45,000 SAR" },
    { code: "AST-991", name: "Underground Tank A1", group: "Machinery", location: "Jeddah Station", value: "120,000 SAR" },
    { code: "AST-773", name: "Office Furniture Set", group: "Furniture", location: "HQ Office", value: "15,000 SAR" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#020713]">Fixed Assets</h1>
          <p className="text-gray-600 mt-2">Track and manage physical assets, equipment, and property</p>
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
        <form onSubmit={(e) => { e.preventDefault(); alert("Fixed Asset saved!"); }} className="bg-white rounded-lg shadow-md p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Asset Code (PK) *</label>
              <input type="text" value={formData.assetCode} onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" required /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
              <input type="text" value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Asset Group (Category)</label>
              <select value={formData.assetGroup} onChange={(e) => setFormData({ ...formData, assetGroup: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]">
                <option value="">Select Category</option>
                <option value="equipment">Equipment</option>
                <option value="furniture">Furniture</option>
                <option value="vehicles">Vehicles</option>
                <option value="buildings">Buildings</option>
                <option value="machinery">Machinery</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Purchase Amount (SAR)</label>
              <input type="number" value={formData.purchaseAmount} onChange={(e) => setFormData({ ...formData, purchaseAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Vendor Name</label>
              <input type="text" value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Depreciation Amount (SAR)</label>
              <input type="number" value={formData.depreciationAmount} onChange={(e) => setFormData({ ...formData, depreciationAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Remaining Balance (SAR)</label>
              <input type="number" value={formData.remainingBalance} onChange={(e) => setFormData({ ...formData, remainingBalance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Asset Owner</label>
              <input type="text" value={formData.assetOwner} onChange={(e) => setFormData({ ...formData, assetOwner: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cost Center</label>
              <input type="text" value={formData.costCenter} onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Station Code (FK)</label>
              <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6b35]" /></div>
          </div>
          <div className="flex justify-end mt-6">
            <button type="submit" className="bg-[#ff6b35] hover:bg-[#ff8c61] text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors">
              <Save className="w-5 h-5" /> Save Fixed Asset
            </button>
          </div>
        </form>
      ) : (
        <FormRecordsList
          title="Fixed Assets"
          columns={["Asset Code", "Asset Name", "Group", "Location", "Value"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
