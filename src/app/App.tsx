import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { Dashboard } from "@/app/components/Dashboard";
import { ExecutiveDashboard } from "@/app/components/ExecutiveDashboard";
import { StationInformationForm } from "@/app/components/forms/StationInformationForm";
import { StationTypeForm } from "@/app/components/forms/StationTypeForm";
import { StationStatusForm } from "@/app/components/forms/StationStatusForm";
import { OwnerInformationForm } from "@/app/components/forms/OwnerInformationForm";
import { DeedInformationForm } from "@/app/components/forms/DeedInformationForm";
import { ContractForm } from "@/app/components/forms/ContractForm";
import { ConsultationOfficeForm } from "@/app/components/forms/ConsultationOfficeForm";
import { ArchitecturalDesignForm } from "@/app/components/forms/ArchitecturalDesignForm";
import { BuildingPermitForm } from "@/app/components/forms/BuildingPermitForm";
import { CommercialLicenseForm } from "@/app/components/forms/CommercialLicenseForm";
import { SalamahLicenseForm } from "@/app/components/forms/SalamahLicenseForm";
import { TaqyeesLicenseForm } from "@/app/components/forms/TaqyeesLicenseForm";
import { EnvironmentalLicenseForm } from "@/app/components/forms/EnvironmentalLicenseForm";
import { EnergyLicenseForm } from "@/app/components/forms/EnergyLicenseForm";
import { FixedAssetsForm } from "@/app/components/forms/FixedAssetsForm";
import { StationsList } from "@/app/components/StationsList";
import { StatItemsList } from "@/app/components/StatItemsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="executive-analytics" element={<ExecutiveDashboard />} />

          {/* Stats Lists */}
          <Route path="total-stations" element={<StationsList />} />
          <Route path="active-licenses" element={<StatItemsList />} />
          <Route path="pending-permits" element={<StatItemsList />} />
          <Route path="active-projects" element={<StatItemsList />} />

          {/* Station Essentials */}
          <Route path="station-information" element={<StationInformationForm />} />
          <Route path="station-type" element={<StationTypeForm />} />
          <Route path="station-status" element={<StationStatusForm />} />

          {/* Ownership & Legal */}
          <Route path="owner-information" element={<OwnerInformationForm />} />
          <Route path="deed-information" element={<DeedInformationForm />} />
          <Route path="contract" element={<ContractForm />} />

          {/* Engineering & Design */}
          <Route path="consultation-office" element={<ConsultationOfficeForm />} />
          <Route path="architectural-design" element={<ArchitecturalDesignForm />} />
          <Route path="building-permit" element={<BuildingPermitForm />} />

          {/* Government Licenses */}
          <Route path="commercial-license" element={<CommercialLicenseForm />} />
          <Route path="salamah-license" element={<SalamahLicenseForm />} />
          <Route path="taqyees-license" element={<TaqyeesLicenseForm />} />
          <Route path="environmental-license" element={<EnvironmentalLicenseForm />} />
          <Route path="energy-license" element={<EnergyLicenseForm />} />

          {/* Assets */}
          <Route path="fixed-assets" element={<FixedAssetsForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;





