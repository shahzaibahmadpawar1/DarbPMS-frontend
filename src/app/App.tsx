import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { Dashboard } from "@/app/components/Dashboard";
import { ExecutiveDashboard } from "@/app/components/ExecutiveDashboard";
import { StationInformationForm } from "@/app/components/forms/StationInformationForm";
import { CamerasForm } from "@/app/components/forms/CamerasForm";
import { DispensersForm } from "@/app/components/forms/DispensersForm";
import { NozzlesForm } from "@/app/components/forms/NozzlesForm";
import { TanksForm } from "@/app/components/forms/TanksForm";
import { AreasForm } from "@/app/components/forms/AreasForm";
import { OwnerInformationForm } from "@/app/components/forms/OwnerInformationForm";
import { DeedInformationForm } from "@/app/components/forms/DeedInformationForm";
import { ContractForm } from "@/app/components/forms/ContractForm";
import { InvestmentForm } from "@/app/components/forms/InvestmentForm";
import { ProjectsForm } from "@/app/components/forms/ProjectsForm";
import { CertificatesForm } from "@/app/components/forms/CertificatesForm";
import { ComplaintContactForm } from "@/app/components/forms/ComplaintContactForm";
import { OperationsManagementPage } from "@/app/components/forms/OperationsManagementPage";
import { HumanResourcePage } from "@/app/components/forms/HumanResourcePage";
import { MarketingDepartmentPage } from "@/app/components/forms/MarketingDepartmentPage";
import { GovernmentRelationsDepartmentPage } from "@/app/components/forms/GovernmentRelationsDepartmentPage";
import { SafetyDepartmentPage } from "@/app/components/forms/SafetyDepartmentPage";
import { CommercialLicenseForm } from "@/app/components/forms/CommercialLicenseForm";
import { SalamahLicenseForm } from "@/app/components/forms/SalamahLicenseForm";
import { TaqyeesLicenseForm } from "@/app/components/forms/TaqyeesLicenseForm";
import { EnvironmentalLicenseForm } from "@/app/components/forms/EnvironmentalLicenseForm";
import { EnergyLicenseForm } from "@/app/components/forms/EnergyLicenseForm";
import { BuildingPermitForm } from "@/app/components/forms/BuildingPermitForm";
import { FixedAssetsForm } from "@/app/components/forms/FixedAssetsForm";
import { SurveyReportForm } from "@/app/components/forms/SurveyReportForm";
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
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { InvestmentDepartmentPage } from "@/app/components/forms/InvestmentDepartmentPage";
import { ProjectDepartmentPage } from "@/app/components/forms/ProjectDepartmentPage";
import { PurchaseDepartmentPage } from "@/app/components/forms/PurchaseDepartmentPage";
import { FinanceDepartmentPage } from "@/app/components/forms/FinanceDepartmentPage";
import { ITDepartmentPage } from "@/app/components/forms/ITDepartmentPage";
import { MaintenanceQualityDepartmentPage } from "@/app/components/forms/MaintenanceQualityDepartmentPage";
import { LegalDepartmentPage } from "@/app/components/forms/LegalDepartmentPage";
import { PropertyDepartmentPage } from "@/app/components/forms/PropertyDepartmentPage";
import { FranchiseDepartmentPage } from "@/app/components/forms/FranchiseDepartmentPage";
import { GovernmentLicenseAttachmentsPage } from "@/app/components/forms/GovernmentLicenseAttachmentsPage";
import { RequestPage } from "@/app/components/RequestPage";
import { UnderReviewProjectsPage } from "@/app/components/UnderReviewProjectsPage";

function App() {
  return (
    <AuthProvider>
      <StationProvider>
        <BrowserRouter>
          <Routes>
            {/* Entry points */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mode-selection" element={<ProtectedRoute><ModeSelectionPage /></ProtectedRoute>} />
            <Route path="/select-station" element={<ProtectedRoute><StationSelectionPage /></ProtectedRoute>} />
            <Route path="/add-new-project" element={<ProtectedRoute><AddNewProjectForm /></ProtectedRoute>} />

            {/* All Stations Dashboard */}
            {/* All Stations Dashboard & Analytics */}
            <Route element={<ProtectedRoute><AllStationsDashboardLayout /></ProtectedRoute>}>
              <Route path="/all-stations-dashboard" element={<Dashboard />} />
              <Route path="/all-stations-analytics" element={<ExecutiveDashboard />} />
              <Route path="/all-stations-list" element={<AllStationsListPage />} />
              <Route path="/all-stations-tasks" element={<TasksPage />} />
              <Route path="/all-stations-reports" element={<ReportsPage />} />
              <Route path="/station/:stationId/analytics" element={<StationAnalyticsPage />} />
              <Route path="/all-stations-requests" element={<RequestPage />} />
              <Route path="/all-stations-under-review" element={<UnderReviewProjectsPage />} />
              <Route path="/all-stations-contact-ceo" element={<ComplaintContactForm />} />

              {/* Station-specific forms nested under the same layout */}
              <Route path="/station/:stationId/form">
                <Route path="station-information" element={<StationInformationForm />} />
                <Route path="cameras" element={<CamerasForm />} />
                <Route path="dispensers" element={<DispensersForm />} />
                <Route path="nozzles" element={<NozzlesForm />} />
                <Route path="tanks" element={<TanksForm />} />
                <Route path="areas" element={<AreasForm />} />
                <Route path="owner-information" element={<OwnerInformationForm />} />
                <Route path="deed-information" element={<DeedInformationForm />} />
                <Route path="building-permit" element={<BuildingPermitForm />} />
                <Route path="contract" element={<ContractForm />} />
                <Route path="investment" element={<InvestmentForm />} />
                <Route path="investment-department" element={<InvestmentDepartmentPage />} />
                <Route path="franchise-department" element={<FranchiseDepartmentPage />} />
                <Route path="projects" element={<ProjectsForm />} />
                <Route path="project-department" element={<ProjectDepartmentPage />} />
                <Route path="operations-management" element={<OperationsManagementPage />} />
                <Route path="property-department" element={<PropertyDepartmentPage />} />
                <Route path="quality-department" element={<MaintenanceQualityDepartmentPage />} />
                <Route path="purchase-department" element={<PurchaseDepartmentPage />} />
                <Route path="maintenance-department" element={<MaintenanceQualityDepartmentPage />} />
                <Route path="legal-department" element={<LegalDepartmentPage />} />
                <Route path="marketing-department" element={<MarketingDepartmentPage />} />
                <Route path="government-relations-department" element={<GovernmentRelationsDepartmentPage />} />
                <Route path="it-department" element={<ITDepartmentPage />} />
                <Route path="human-resource" element={<HumanResourcePage />} />
                <Route path="finance-department" element={<FinanceDepartmentPage />} />
                <Route path="safety" element={<SafetyDepartmentPage />} />
                <Route path="certificates" element={<CertificatesForm />} />
                <Route path="commercial-license" element={<CommercialLicenseForm />} />
                <Route path="salamah-license" element={<SalamahLicenseForm />} />
                <Route path="taqyees-license" element={<TaqyeesLicenseForm />} />
                <Route path="environmental-license" element={<EnvironmentalLicenseForm />} />
                <Route path="government-license-attachments" element={<GovernmentLicenseAttachmentsPage />} />
                <Route path="survey-report" element={<SurveyReportForm />} />
                <Route path="fixed-assets" element={<FixedAssetsForm />} />
              </Route>
            </Route>


            {/* Single Station Dashboard (after selection) */}
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<SingleStationDashboard />} />
              <Route path="executive-analytics" element={<SingleStationAnalytics />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="requests" element={<RequestPage />} />
              <Route path="under-review" element={<UnderReviewProjectsPage />} />

              {/* Stats Lists */}
              <Route path="total-stations" element={<StationsList />} />
              <Route path="active-licenses" element={<StatItemsList />} />
              <Route path="pending-permits" element={<StatItemsList />} />
              <Route path="active-projects" element={<StatItemsList />} />

              {/* Station Essentials */}
              <Route path="station-information" element={<StationInformationForm />} />
              <Route path="cameras" element={<CamerasForm />} />
              <Route path="dispensers" element={<DispensersForm />} />
              <Route path="nozzles" element={<NozzlesForm />} />
              <Route path="tanks" element={<TanksForm />} />
              <Route path="areas" element={<AreasForm />} />

              {/* Ownership & Legal */}
              <Route path="owner-information" element={<OwnerInformationForm />} />
              <Route path="deed-information" element={<DeedInformationForm />} />
              <Route path="building-permit" element={<BuildingPermitForm />} />
              <Route path="contract" element={<ContractForm />} />
              <Route path="commercial-license" element={<CommercialLicenseForm />} />

              {/* Government Licenses */}
              <Route path="salamah-license" element={<SalamahLicenseForm />} />
              <Route path="taqyees-license" element={<TaqyeesLicenseForm />} />
              <Route path="environmental-license" element={<EnvironmentalLicenseForm />} />
              <Route path="energy-license" element={<EnergyLicenseForm />} />

              {/* Departments */}
              <Route path="investment" element={<InvestmentForm />} />
              <Route path="investment-department" element={<InvestmentDepartmentPage />} />
              <Route path="franchise-department" element={<FranchiseDepartmentPage />} />
              <Route path="projects" element={<ProjectsForm />} />
              <Route path="project-department" element={<ProjectDepartmentPage />} />
              <Route path="operations-management" element={<OperationsManagementPage />} />
              <Route path="property-department" element={<PropertyDepartmentPage />} />
              <Route path="quality-department" element={<MaintenanceQualityDepartmentPage />} />
              <Route path="purchase-department" element={<PurchaseDepartmentPage />} />
              <Route path="maintenance-department" element={<MaintenanceQualityDepartmentPage />} />
              <Route path="legal-department" element={<LegalDepartmentPage />} />
              <Route path="marketing-department" element={<MarketingDepartmentPage />} />
              <Route path="government-relations-department" element={<GovernmentRelationsDepartmentPage />} />
              <Route path="it-department" element={<ITDepartmentPage />} />
              <Route path="human-resource" element={<HumanResourcePage />} />
              <Route path="finance-department" element={<FinanceDepartmentPage />} />
              <Route path="safety" element={<SafetyDepartmentPage />} />
              <Route path="certificates" element={<CertificatesForm />} />
              <Route path="requests" element={<RequestPage />} />

              {/* Government Licenses */}
              <Route path="commercial-license" element={<CommercialLicenseForm />} />
              <Route path="salamah-license" element={<SalamahLicenseForm />} />
              <Route path="taqyees-license" element={<TaqyeesLicenseForm />} />
              <Route path="environmental-license" element={<EnvironmentalLicenseForm />} />
              <Route path="energy-license" element={<EnergyLicenseForm />} />

              {/* Project Survey Report */}
              <Route path="survey-report" element={<SurveyReportForm />} />

              {/* Assets */}
              <Route path="fixed-assets" element={<FixedAssetsForm />} />

              {/* Contact CEO */}
              <Route path="contact-ceo" element={<ComplaintContactForm />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StationProvider>
    </AuthProvider>
  );
}

export default App;





