import { useState } from "react";
import { Save, List, Eye, FileCheck } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

function LicenseField({ label, name, value, type = "text", onChange, disabled }: {
  label: string; name: string; value: string; type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-muted-foreground mb-1">{label}</label>
      {name === "licenseStatus" ? (
        <select name={name} value={value} onChange={onChange} disabled={disabled}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground">
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="pending">Pending Renewal</option>
        </select>
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} disabled={disabled}
          className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" />
      )}
    </div>
  );
}

export function SalamahLicenseForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';
  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');

  const [formData, setFormData] = useState({
    licenseNo: isReadOnly ? "SAL-99812-2024" : "",
    issuanceDate: isReadOnly ? "2024-02-15" : "",
    licenseExpiryDate: isReadOnly ? "2025-02-14" : "",
    numberOfDays: isReadOnly ? "365" : "",
    licenseStatus: isReadOnly ? "active" : "",
    investorName: isReadOnly ? "Darb Al Sultan Co." : "",
    ministryOfInteriorNo: isReadOnly ? "MOI-772938" : "",
    nationalAddress: isReadOnly ? "7721 King Fahd Rd, Riyadh" : "",
    commercialRegister: isReadOnly ? "1010293848" : "",
    facilityName: isReadOnly ? "Location N101 Station" : "",
    branch: isReadOnly ? "Main Branch" : "",
    area: isReadOnly ? "Central Region" : "",
    city: isReadOnly ? "Riyadh" : "",
    district: isReadOnly ? "Al-Malqa" : "",
    street: isReadOnly ? "King Fahd Road" : "",
    landNo: isReadOnly ? "L-229-B" : "",
    shopSpace: isReadOnly ? "450" : "",
    stationCode: isReadOnly ? "N101" : "",
    officeCode: isReadOnly ? "OFF-001" : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const mockRecords = [
    { "License No": "SAL-9981", "Facility Name": "Darb Al Sultan", "Investor": "Ahmed Mansour", "Expiry Date": "2025-12-31", "Status": "Active" },
    { "License No": "SAL-9985", "Facility Name": "Jeddah North", "Investor": "Sarah Al-Otaibi", "Expiry Date": "2025-11-20", "Status": "Active" },
  ];

  const fields: { label: string; name: string; type?: string }[] = [
    { label: "License No", name: "licenseNo" },
    { label: "Issuance Date", name: "issuanceDate", type: "date" },
    { label: "License Expiry Date", name: "licenseExpiryDate", type: "date" },
    { label: "Number of Days", name: "numberOfDays", type: "number" },
    { label: "License Status", name: "licenseStatus" },
    { label: "Investor Name", name: "investorName" },
    { label: "Ministry of Interior No", name: "ministryOfInteriorNo" },
    { label: "The National Address", name: "nationalAddress" },
    { label: "Commercial Register", name: "commercialRegister" },
    { label: "Facility Name", name: "facilityName" },
    { label: "Branch", name: "branch" },
    { label: "Area", name: "area" },
    { label: "City", name: "city" },
    { label: "District", name: "district" },
    { label: "Street", name: "street" },
    { label: "Land No", name: "landNo" },
    { label: "Shop Space (m²)", name: "shopSpace", type: "number" },
    { label: "Station Code", name: "stationCode" },
    { label: "Office Code", name: "officeCode" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Salamah Civil Defense License</h1>
          <p className="text-muted-foreground mt-2">Manage safety and fire protection compliance certificates</p>
        </div>
        {isReadOnly ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" /><span className="text-sm font-semibold">View Only Mode</span>
          </div>
        ) : (
          <div className="flex bg-muted p-1 rounded-xl w-fit">
            <button onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <FileCheck className="w-4 h-4" /><span>New Entry</span>
            </button>
            <button onClick={() => setViewMode('records')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              <List className="w-4 h-4" /><span>View Records</span>
            </button>
          </div>
        )}
      </div>

      {viewMode === 'form' ? (
        <form onSubmit={(e) => { e.preventDefault(); alert("Salamah License saved!"); }}
          className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fields.map(f => (
              <LicenseField key={f.name} label={f.label} name={f.name} value={(formData as any)[f.name]}
                type={f.type} onChange={handleChange} disabled={isReadOnly} />
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
