import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function FixedAssetsForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    assetCode: isReadOnly ? "AST-N101-001" : "",
    assetName: isReadOnly ? "High-Flow Fuel Dispenser A1" : "",
    assetGroup: isReadOnly ? "equipment" : "",
    location: isReadOnly ? "Location N101 - Primary Pump Island" : "",
    purchaseAmount: isReadOnly ? "85000" : "",
    vendorName: isReadOnly ? "Wayne Fueling Systems" : "",
    depreciationAmount: isReadOnly ? "12500" : "",
    remainingBalance: isReadOnly ? "72500" : "",
    assetOwner: isReadOnly ? "Darb Co." : "",
    costCenter: isReadOnly ? "CC-Riyadh-North" : "",
    stationCode: isReadOnly ? "N101" : ""
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
          <h1 className="text-3xl font-bold text-foreground">Fixed Assets</h1>
          <p className="text-muted-foreground mt-2">Track and manage physical assets, equipment, and property</p>
        </div>

        {!isReadOnly && (
          <div className="flex bg-muted p-1 rounded-xl w-fit">
            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Entry</span>
            </button>
            <button
              onClick={() => setViewMode('records')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <List className="w-4 h-4" />
              <span>View Records</span>
            </button>
          </div>
        )}

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={(e) => { e.preventDefault(); alert("Fixed Asset saved!"); }} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Asset Code (PK) *</label>
              <input type="text" value={formData.assetCode} onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" required disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Asset Name</label>
              <input type="text" value={formData.assetName} onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Asset Group (Category)</label>
              <select value={formData.assetGroup} onChange={(e) => setFormData({ ...formData, assetGroup: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly}>
                <option value="">Select Category</option>
                <option value="equipment">Equipment</option>
                <option value="furniture">Furniture</option>
                <option value="vehicles">Vehicles</option>
                <option value="buildings">Buildings</option>
                <option value="machinery">Machinery</option>
              </select>
            </div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Purchase Amount (SAR)</label>
              <input type="number" value={formData.purchaseAmount} onChange={(e) => setFormData({ ...formData, purchaseAmount: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Vendor Name</label>
              <input type="text" value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Depreciation Amount (SAR)</label>
              <input type="number" value={formData.depreciationAmount} onChange={(e) => setFormData({ ...formData, depreciationAmount: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Remaining Balance (SAR)</label>
              <input type="number" value={formData.remainingBalance} onChange={(e) => setFormData({ ...formData, remainingBalance: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Asset Owner</label>
              <input type="text" value={formData.assetOwner} onChange={(e) => setFormData({ ...formData, assetOwner: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Cost Center</label>
              <input type="text" value={formData.costCenter} onChange={(e) => setFormData({ ...formData, costCenter: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Station Code (FK)</label>
              <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button type="submit" className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20">
                <Save className="w-5 h-5" /> Save Fixed Asset
              </button>
            </div>
          )}
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
