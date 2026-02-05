import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { Dashboard } from "@/app/components/Dashboard";
import { ExecutiveDashboard } from "@/app/components/ExecutiveDashboard";
import { StationInformationForm } from "@/app/components/forms/StationInformationForm";
import { StationTypeForm } from "@/app/components/forms/StationTypeForm";
import { StationStatusForm } from "@/app/components/forms/StationStatusForm";
import { OwnerInformationForm } from "@/app/components/forms/OwnerInformationForm";
import { DeedInformationForm } from "@/app/components/forms/DeedInformationForm";
import { ContractForm } from "@/app/components/forms/ContractForm";
import { InvestmentForm } from "@/app/components/forms/InvestmentForm";
import { ProjectsForm } from "@/app/components/forms/ProjectsForm";
import { OperationsManagementForm } from "@/app/components/forms/OperationsManagementForm";
import { FranchiseManagementForm } from "@/app/components/forms/FranchiseManagementForm";
import { PropertyManagementForm } from "@/app/components/forms/PropertyManagementForm";
import { QualityManagementForm } from "@/app/components/forms/QualityManagementForm";
import { ProcurementDepartmentForm } from "@/app/components/forms/ProcurementDepartmentForm";
import { MaintenanceDepartmentForm } from "@/app/components/forms/MaintenanceDepartmentForm";
import { LegalDepartmentForm } from "@/app/components/forms/LegalDepartmentForm";
import { MarketingDepartmentForm } from "@/app/components/forms/MarketingDepartmentForm";
import { GovernmentRelationsDepartmentForm } from "@/app/components/forms/GovernmentRelationsDepartmentForm";
import { ITManagementForm } from "@/app/components/forms/ITManagementForm";
import { HumanResourceForm } from "@/app/components/forms/HumanResourceForm";
import { FinanceForm } from "@/app/components/forms/FinanceForm";
import { SafetyForm } from "@/app/components/forms/SafetyForm";
import { CertificatesForm } from "@/app/components/forms/CertificatesForm";
import { ComplaintContactForm } from "@/app/components/forms/ComplaintContactForm";
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
import { SingleStationDashboard } from "@/app/components/SingleStationDashboard";
import { ReportsPage } from "@/app/components/ReportsPage";
import { AddNewProjectForm } from "@/app/components/AddNewProjectForm";
import { TasksPage } from "@/app/components/TasksPage";
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
          <Route path="/add-new-project" element={<AddNewProjectForm />} />

          {/* All Stations Dashboard */}
          <Route element={<AllStationsDashboardLayout />}>
            <Route path="/all-stations-dashboard" element={<Dashboard />} />
            <Route path="/all-stations-analytics" element={<ExecutiveDashboard />} />
            <Route path="/all-stations-list" element={<AllStationsListPage />} />
            <Route path="/all-stations-tasks" element={<TasksPage />} />
            <Route path="/all-stations-reports" element={<ReportsPage />} />
            <Route path="/station/:stationId/analytics" element={<StationAnalyticsPage />} />
            <Route path="/all-stations-contact-ceo" element={<ComplaintContactForm />} />

            {/* Station-specific forms */}
            <Route path="/station/:stationId/form/station-information" element={<StationInformationForm />} />
            <Route path="/station/:stationId/form/station-type" element={<StationTypeForm />} />
            <Route path="/station/:stationId/form/station-status" element={<StationStatusForm />} />
            <Route path="/station/:stationId/form/owner-information" element={<OwnerInformationForm />} />
            <Route path="/station/:stationId/form/deed-information" element={<DeedInformationForm />} />
            <Route path="/station/:stationId/form/contract" element={<ContractForm />} />
            <Route path="/station/:stationId/form/investment" element={<InvestmentForm />} />
            <Route path="/station/:stationId/form/projects" element={<ProjectsForm />} />
            <Route path="/station/:stationId/form/operations-management" element={<OperationsManagementForm />} />
            <Route path="/station/:stationId/form/franchise-management" element={<FranchiseManagementForm />} />
            <Route path="/station/:stationId/form/property-management" element={<PropertyManagementForm />} />
            <Route path="/station/:stationId/form/quality-management" element={<QualityManagementForm />} />
            <Route path="/station/:stationId/form/procurement-department" element={<ProcurementDepartmentForm />} />
            <Route path="/station/:stationId/form/maintenance-department" element={<MaintenanceDepartmentForm />} />
            <Route path="/station/:stationId/form/legal-department" element={<LegalDepartmentForm />} />
            <Route path="/station/:stationId/form/marketing-department" element={<MarketingDepartmentForm />} />
            <Route path="/station/:stationId/form/government-relations-department" element={<GovernmentRelationsDepartmentForm />} />
            <Route path="/station/:stationId/form/it-management" element={<ITManagementForm />} />
            <Route path="/station/:stationId/form/human-resource" element={<HumanResourceForm />} />
            <Route path="/station/:stationId/form/finance" element={<FinanceForm />} />
            <Route path="/station/:stationId/form/safety" element={<SafetyForm />} />
            <Route path="/station/:stationId/form/certificates" element={<CertificatesForm />} />
            <Route path="/station/:stationId/form/commercial-license" element={<CommercialLicenseForm />} />
            <Route path="/station/:stationId/form/salamah-license" element={<SalamahLicenseForm />} />
            <Route path="/station/:stationId/form/taqyees-license" element={<TaqyeesLicenseForm />} />
            <Route path="/station/:stationId/form/environmental-license" element={<EnvironmentalLicenseForm />} />
            <Route path="/station/:stationId/form/energy-license" element={<EnergyLicenseForm />} />
            <Route path="/station/:stationId/form/fixed-assets" element={<FixedAssetsForm />} />
          </Route>


          {/* Single Station Dashboard (after selection) */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<SingleStationDashboard />} />
            <Route path="executive-analytics" element={<SingleStationAnalytics />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="reports" element={<ReportsPage />} />

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

            {/* Departments */}
            <Route path="investment" element={<InvestmentForm />} />
            <Route path="projects" element={<ProjectsForm />} />
            <Route path="operations-management" element={<OperationsManagementForm />} />
            <Route path="franchise-management" element={<FranchiseManagementForm />} />
            <Route path="property-management" element={<PropertyManagementForm />} />
            <Route path="quality-management" element={<QualityManagementForm />} />
            <Route path="procurement-department" element={<ProcurementDepartmentForm />} />
            <Route path="maintenance-department" element={<MaintenanceDepartmentForm />} />
            <Route path="legal-department" element={<LegalDepartmentForm />} />
            <Route path="marketing-department" element={<MarketingDepartmentForm />} />
            <Route path="government-relations-department" element={<GovernmentRelationsDepartmentForm />} />
            <Route path="it-management" element={<ITManagementForm />} />
            <Route path="human-resource" element={<HumanResourceForm />} />
            <Route path="finance" element={<FinanceForm />} />
            <Route path="safety" element={<SafetyForm />} />
            <Route path="certificates" element={<CertificatesForm />} />

            {/* Government Licenses */}
            <Route path="commercial-license" element={<CommercialLicenseForm />} />
            <Route path="salamah-license" element={<SalamahLicenseForm />} />
            <Route path="taqyees-license" element={<TaqyeesLicenseForm />} />
            <Route path="environmental-license" element={<EnvironmentalLicenseForm />} />
            <Route path="energy-license" element={<EnergyLicenseForm />} />

            {/* Assets */}
            <Route path="fixed-assets" element={<FixedAssetsForm />} />

            {/* Contact CEO */}
            <Route path="contact-ceo" element={<ComplaintContactForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StationProvider>
  );
}

export default App;





