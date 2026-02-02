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
import { LoginPage } from "@/app/components/LoginPage";
import { StationSelectionPage } from "@/app/components/StationSelectionPage";
import { ModeSelectionPage } from "@/app/components/ModeSelectionPage";
import { AllStationsDashboardLayout } from "@/app/components/AllStationsDashboardLayout";
import { AllStationsListPage } from "@/app/components/AllStationsListPage";
import { StationAnalyticsPage } from "@/app/components/StationAnalyticsPage";
import { SingleStationAnalytics } from "@/app/components/SingleStationAnalytics";
import { StationProvider } from "@/app/context/StationContext";

function App() {
  return (
    <StationProvider>
      <BrowserRouter>
        <Routes>
          {/* Entry points */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mode-selection" element={<ModeSelectionPage />} />
          <Route path="/select-station" element={<StationSelectionPage />} />

          {/* All Stations Dashboard */}
          <Route element={<AllStationsDashboardLayout />}>
            <Route path="/all-stations-dashboard" element={<Dashboard />} />
            <Route path="/all-stations-analytics" element={<ExecutiveDashboard />} />
            <Route path="/all-stations-list" element={<AllStationsListPage />} />
            <Route path="/station/:stationId/analytics" element={<StationAnalyticsPage />} />

            {/* Station-specific forms */}
            <Route path="/station/:stationId/form/station-information" element={<StationInformationForm />} />
            <Route path="/station/:stationId/form/station-type" element={<StationTypeForm />} />
            <Route path="/station/:stationId/form/station-status" element={<StationStatusForm />} />
            <Route path="/station/:stationId/form/owner-information" element={<OwnerInformationForm />} />
            <Route path="/station/:stationId/form/deed-information" element={<DeedInformationForm />} />
            <Route path="/station/:stationId/form/contract" element={<ContractForm />} />
            <Route path="/station/:stationId/form/consultation-office" element={<ConsultationOfficeForm />} />
            <Route path="/station/:stationId/form/architectural-design" element={<ArchitecturalDesignForm />} />
            <Route path="/station/:stationId/form/building-permit" element={<BuildingPermitForm />} />
            <Route path="/station/:stationId/form/commercial-license" element={<CommercialLicenseForm />} />
            <Route path="/station/:stationId/form/salamah-license" element={<SalamahLicenseForm />} />
            <Route path="/station/:stationId/form/taqyees-license" element={<TaqyeesLicenseForm />} />
            <Route path="/station/:stationId/form/environmental-license" element={<EnvironmentalLicenseForm />} />
            <Route path="/station/:stationId/form/energy-license" element={<EnergyLicenseForm />} />
            <Route path="/station/:stationId/form/fixed-assets" element={<FixedAssetsForm />} />
          </Route>

          {/* Single Station Dashboard (after selection) */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/executive-analytics" element={<SingleStationAnalytics />} />

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
    </StationProvider>
  );
}

export default App;





