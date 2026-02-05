import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function OwnerInformationForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');

  // Pre-filled demo data for single station mode
  const [formData, setFormData] = useState({
    ownerId: isReadOnly ? "1023948572" : "",
    ownerName: isReadOnly ? "Ahmed bin Abdullah Al-Mansour" : "",
    idIssueDate: isReadOnly ? "2018-03-15" : "",
    idIssuePlace: isReadOnly ? "Riyadh" : "",
    ownerMobile: isReadOnly ? "+966 50 123 4567" : "",
    ownerAddress: isReadOnly ? "King Fahd Road, Al-Malqa District, Riyadh" : "",
    ownerEmail: isReadOnly ? "ahmed.almansour@darbstation.sa" : "",
    stationTypeCode: isReadOnly ? "1" : "",
    stationCode: isReadOnly ? "N101" : "",
  });

  const mockRecords = [
    { id: "1023948572", name: "Ahmed Mansour", mobile: "+966 50 123 4567", email: "ahmed@example.com", station: "ST-201" },
    { id: "1092837465", name: "Sarah Al-Otaibi", mobile: "+966 55 987 6543", email: "sarah@example.com", station: "ST-202" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Owner Information:", formData);
    alert("Owner Information saved successfully!");
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Owner Information</h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "View owner details" : "Manage station owner details and contact information"}
          </p>
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
        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Owner ID/National ID (PK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ownerId}
                onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                required
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                required
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">ID Issue Date</label>
              <input
                type="date"
                value={formData.idIssueDate}
                onChange={(e) => setFormData({ ...formData, idIssueDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">ID Issue Place</label>
              <input
                type="text"
                value={formData.idIssuePlace}
                onChange={(e) => setFormData({ ...formData, idIssuePlace: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Mobile</label>
              <input
                type="tel"
                value={formData.ownerMobile}
                onChange={(e) => setFormData({ ...formData, ownerMobile: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Email</label>
              <input
                type="email"
                value={formData.ownerEmail}
                onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                disabled={isReadOnly}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Owner Address</label>
              <textarea
                value={formData.ownerAddress}
                onChange={(e) => setFormData({ ...formData, ownerAddress: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                rows={3}
                disabled={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Station Type Code (FK)</label>
              <select
                value={formData.stationTypeCode}
                onChange={(e) => setFormData({ ...formData, stationTypeCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                disabled={isReadOnly}
              >
                <option value="">Select Type</option>
                <option value="1">Owned Station</option>
                <option value="2">Rented Station</option>
                <option value="3">Operation</option>
                <option value="4">Franchise</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Station Code (FK)</label>
              <input
                type="text"
                value={formData.stationCode}
                onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                disabled={isReadOnly}
              />
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
              >
                <Save className="w-5 h-5" />
                Save Owner Information
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Owner Information"
          columns={["ID/National ID", "Name", "Mobile", "Email", "Station Code"]}
          records={mockRecords}
        />
      )}
    </div>
  );
}
