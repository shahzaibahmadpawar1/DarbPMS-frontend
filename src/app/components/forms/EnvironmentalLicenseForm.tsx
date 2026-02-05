import { useState } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

export function EnvironmentalLicenseForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [formData, setFormData] = useState({
    issuanceNumber: isReadOnly ? "ENV-2024-88029" : "",
    issuanceDate: isReadOnly ? "2024-05-10" : "",
    expiryDate: isReadOnly ? "2025-05-10" : "",
    numberOfDays: isReadOnly ? "365" : "",
    licenseStatus: isReadOnly ? "active" : "",
    facilityName: isReadOnly ? "Location N101 Main Station" : "",
    ownerName: isReadOnly ? "Darb Al Sultan Petroleum" : "",
    address: isReadOnly ? "King Fahd Road, Al-Malqa, Riyadh" : "",
    facilityNumber: isReadOnly ? "FAC-7721" : "",
    geographicLocation: isReadOnly ? "24.8210° N, 46.6120° E" : "",
    commercialRegister: isReadOnly ? "1010293848" : "",
    workScope: isReadOnly ? "Fuel Station Operations & Retail" : "",
    businessType: isReadOnly ? "Industrial" : "",
    orderNumber: isReadOnly ? "ORD-9921" : "",
    orderDate: isReadOnly ? "2024-04-15" : "",
    phone: isReadOnly ? "+966 11 293 8484" : "",
    fax: isReadOnly ? "+966 11 293 8485" : "",
    mailbox: isReadOnly ? "P.O. Box 8821, Riyadh 11492" : "",
    city: isReadOnly ? "Riyadh" : "",
    issuedBy: isReadOnly ? "NCEC" : "",
    stationCode: isReadOnly ? "N101" : "",
    officeCode: isReadOnly ? "OFF-201" : ""
  });

  const mockRecords = [
    { no: "ENV-2024-88", facility: "Darb Riyadh", city: "Riyadh", expiry: "2025-06-30", status: "Active" },
    { no: "ENV-2024-92", facility: "Jeddah Station", city: "Jeddah", expiry: "2025-08-15", status: "Active" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Environmental License</h1>
          <p className="text-muted-foreground mt-2">Manage environmental compliance and impact assessments</p>
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
        <form onSubmit={(e) => { e.preventDefault(); alert("Environmental License saved!"); }} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-muted-foreground mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input
                  type={key.includes('Date') ? 'date' : key.includes('Days') ? 'number' : 'text'}
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
                <Save className="w-5 h-5" /> Save Environmental License
              </button>
            </div>
          )}
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
