import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function SalamahLicenseForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    licenseNumber: isReadOnly ? "SAL-99812-2024" : "",
    issuanceDate: isReadOnly ? "2024-02-15" : "",
    expiryDate: isReadOnly ? "2025-02-14" : "",
    numberOfDays: isReadOnly ? "365" : "",
    licenseStatus: isReadOnly ? "active" : "",
    investorName: isReadOnly ? "Darb Al Sultan Co." : "",
    moiNumber: isReadOnly ? "MOI-772938" : "",
    nationalAddress: isReadOnly ? "7721 King Fahd Rd, Riyadh" : "",
    commercialRegister: isReadOnly ? "1010293848" : "",
    facilityName: isReadOnly ? "Location N101 Station" : "",
    branchName: isReadOnly ? "Main Branch" : "",
    area: isReadOnly ? "Central Region" : "",
    city: isReadOnly ? "Riyadh" : "",
    district: isReadOnly ? "Al-Malqa" : "",
    street: isReadOnly ? "King Fahd Road" : "",
    landNumber: isReadOnly ? "L-229-B" : "",
    shopSpace: isReadOnly ? "450" : "",
    stationCode: isReadOnly ? "N101" : "",
    officeCode: isReadOnly ? "OFF-001" : ""
  });

  const mockRecords = [
    { no: "SAL-9981", facility: "Darb Al Sultan", investor: "Ahmed Mansour", expiry: "2025-12-31", status: "Active" },
    { no: "SAL-9985", facility: "Jeddah North", investor: "Sarah Al-Otaibi", expiry: "2025-11-20", status: "Active" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Salamah Civil Defense License</h1>
          <p className="text-muted-foreground mt-2">Manage safety and fire protection compliance certificates</p>
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
        <form onSubmit={(e) => { e.preventDefault(); alert("Salamah License saved!"); }} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-muted-foreground mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type={key.includes('Date') ? 'date' : key.includes('Number') || key.includes('Days') || key.includes('Space') ? 'number' : 'text'}
                  value={value}
                  onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                />
              </div>
            ))}
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button type="submit" className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20">
                <Save className="w-5 h-5" /> Save Salamah License
              </button>
            </div>
          )}
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
