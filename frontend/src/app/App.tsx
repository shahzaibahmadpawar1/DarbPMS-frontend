import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { StationProvider } from "@/app/context/StationContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const DashboardLayout = lazy(() => import("@/app/components/DashboardLayout").then((m) => ({ default: m.DashboardLayout })));
const Dashboard = lazy(() => import("@/app/components/Dashboard").then((m) => ({ default: m.Dashboard })));
const ExecutiveDashboard = lazy(() => import("@/app/components/ExecutiveDashboard").then((m) => ({ default: m.ExecutiveDashboard })));
const StationInformationForm = lazy(() => import("@/app/components/forms/StationInformationForm").then((m) => ({ default: m.StationInformationForm })));
const CamerasForm = lazy(() => import("@/app/components/forms/CamerasForm").then((m) => ({ default: m.CamerasForm })));
const DispensersForm = lazy(() => import("@/app/components/forms/DispensersForm").then((m) => ({ default: m.DispensersForm })));
const NozzlesForm = lazy(() => import("@/app/components/forms/NozzlesForm").then((m) => ({ default: m.NozzlesForm })));
const TanksForm = lazy(() => import("@/app/components/forms/TanksForm").then((m) => ({ default: m.TanksForm })));
const AreasForm = lazy(() => import("@/app/components/forms/AreasForm").then((m) => ({ default: m.AreasForm })));
const OwnerInformationForm = lazy(() => import("@/app/components/forms/OwnerInformationForm").then((m) => ({ default: m.OwnerInformationForm })));
const DeedInformationForm = lazy(() => import("@/app/components/forms/DeedInformationForm").then((m) => ({ default: m.DeedInformationForm })));
const ContractForm = lazy(() => import("@/app/components/forms/ContractForm").then((m) => ({ default: m.ContractForm })));
const InvestmentForm = lazy(() => import("@/app/components/forms/InvestmentForm").then((m) => ({ default: m.InvestmentForm })));
const ProjectsForm = lazy(() => import("@/app/components/forms/ProjectsForm").then((m) => ({ default: m.ProjectsForm })));
const CertificatesForm = lazy(() => import("@/app/components/forms/CertificatesForm").then((m) => ({ default: m.CertificatesForm })));
const ComplaintContactForm = lazy(() => import("@/app/components/forms/ComplaintContactForm").then((m) => ({ default: m.ComplaintContactForm })));
const OperationsManagementPage = lazy(() => import("@/app/components/forms/OperationsManagementPage").then((m) => ({ default: m.OperationsManagementPage })));
const HumanResourcePage = lazy(() => import("@/app/components/forms/HumanResourcePage").then((m) => ({ default: m.HumanResourcePage })));
const MarketingDepartmentPage = lazy(() => import("@/app/components/forms/MarketingDepartmentPage").then((m) => ({ default: m.MarketingDepartmentPage })));
const GovernmentRelationsDepartmentPage = lazy(() => import("@/app/components/forms/GovernmentRelationsDepartmentPage").then((m) => ({ default: m.GovernmentRelationsDepartmentPage })));
const SafetyDepartmentPage = lazy(() => import("@/app/components/forms/SafetyDepartmentPage").then((m) => ({ default: m.SafetyDepartmentPage })));
const CommercialLicenseForm = lazy(() => import("@/app/components/forms/CommercialLicenseForm").then((m) => ({ default: m.CommercialLicenseForm })));
const SalamahLicenseForm = lazy(() => import("@/app/components/forms/SalamahLicenseForm").then((m) => ({ default: m.SalamahLicenseForm })));
const TaqyeesLicenseForm = lazy(() => import("@/app/components/forms/TaqyeesLicenseForm").then((m) => ({ default: m.TaqyeesLicenseForm })));
const EnvironmentalLicenseForm = lazy(() => import("@/app/components/forms/EnvironmentalLicenseForm").then((m) => ({ default: m.EnvironmentalLicenseForm })));
const EnergyLicenseForm = lazy(() => import("@/app/components/forms/EnergyLicenseForm").then((m) => ({ default: m.EnergyLicenseForm })));
const BuildingPermitForm = lazy(() => import("@/app/components/forms/BuildingPermitForm").then((m) => ({ default: m.BuildingPermitForm })));
const FixedAssetsForm = lazy(() => import("@/app/components/forms/FixedAssetsForm").then((m) => ({ default: m.FixedAssetsForm })));
const SurveyReportForm = lazy(() => import("@/app/components/forms/SurveyReportForm").then((m) => ({ default: m.SurveyReportForm })));
const StationsList = lazy(() => import("@/app/components/StationsList").then((m) => ({ default: m.StationsList })));
const StatItemsList = lazy(() => import("@/app/components/StatItemsList").then((m) => ({ default: m.StatItemsList })));
const LoginPage = lazy(() => import("@/app/components/LoginPage").then((m) => ({ default: m.LoginPage })));
const StationSelectionPage = lazy(() => import("@/app/components/StationSelectionPage").then((m) => ({ default: m.StationSelectionPage })));
const ModeSelectionPage = lazy(() => import("@/app/components/ModeSelectionPage").then((m) => ({ default: m.ModeSelectionPage })));
const AllStationsDashboardLayout = lazy(() => import("@/app/components/AllStationsDashboardLayout").then((m) => ({ default: m.AllStationsDashboardLayout })));
const DepartmentsPage = lazy(() => import("@/app/components/DepartmentsPage").then((m) => ({ default: m.DepartmentsPage })));
const AllStationsListPage = lazy(() => import("@/app/components/AllStationsListPage").then((m) => ({ default: m.AllStationsListPage })));
const StationAnalyticsPage = lazy(() => import("@/app/components/StationAnalyticsPage").then((m) => ({ default: m.StationAnalyticsPage })));
const StationFormsPage = lazy(() => import("@/app/components/StationFormsPage").then((m) => ({ default: m.StationFormsPage })));
const SingleStationAnalytics = lazy(() => import("@/app/components/SingleStationAnalytics").then((m) => ({ default: m.SingleStationAnalytics })));
const SingleStationDashboard = lazy(() => import("@/app/components/SingleStationDashboard").then((m) => ({ default: m.SingleStationDashboard })));
const ReportsPage = lazy(() => import("@/app/components/ReportsPage").then((m) => ({ default: m.ReportsPage })));
const TasksPage = lazy(() => import("@/app/components/TasksPage").then((m) => ({ default: m.TasksPage })));
const InvestmentDepartmentPage = lazy(() => import("@/app/components/forms/InvestmentDepartmentPage").then((m) => ({ default: m.InvestmentDepartmentPage })));
const ProjectDepartmentPage = lazy(() => import("@/app/components/forms/ProjectDepartmentPage").then((m) => ({ default: m.ProjectDepartmentPage })));
const PurchaseDepartmentPage = lazy(() => import("@/app/components/forms/PurchaseDepartmentPage").then((m) => ({ default: m.PurchaseDepartmentPage })));
const FinanceDepartmentPage = lazy(() => import("@/app/components/forms/FinanceDepartmentPage").then((m) => ({ default: m.FinanceDepartmentPage })));
const ITDepartmentPage = lazy(() => import("@/app/components/forms/ITDepartmentPage").then((m) => ({ default: m.ITDepartmentPage })));
const MaintenanceQualityDepartmentPage = lazy(() => import("@/app/components/forms/MaintenanceQualityDepartmentPage").then((m) => ({ default: m.MaintenanceQualityDepartmentPage })));
const LegalDepartmentPage = lazy(() => import("@/app/components/forms/LegalDepartmentPage").then((m) => ({ default: m.LegalDepartmentPage })));
const PropertyDepartmentPage = lazy(() => import("@/app/components/forms/PropertyDepartmentPage").then((m) => ({ default: m.PropertyDepartmentPage })));
const FranchiseDepartmentPage = lazy(() => import("@/app/components/forms/FranchiseDepartmentPage").then((m) => ({ default: m.FranchiseDepartmentPage })));
const GovernmentLicenseAttachmentsPage = lazy(() => import("@/app/components/forms/GovernmentLicenseAttachmentsPage").then((m) => ({ default: m.GovernmentLicenseAttachmentsPage })));
const RequestPage = lazy(() => import("@/app/components/RequestPage").then((m) => ({ default: m.RequestPage })));
const UnderReviewProjectsPage = lazy(() => import("@/app/components/UnderReviewProjectsPage").then((m) => ({ default: m.UnderReviewProjectsPage })));
const UsersPage = lazy(() => import("@/app/components/UsersPage").then((m) => ({ default: m.UsersPage })));
const ActivityHistoryPage = lazy(() => import("@/app/components/ActivityHistoryPage").then((m) => ({ default: m.ActivityHistoryPage })));

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <StationProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Entry points */}
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/mode-selection" element={<ProtectedRoute><ModeSelectionPage /></ProtectedRoute>} />
            <Route path="/select-station" element={<ProtectedRoute><StationSelectionPage /></ProtectedRoute>} />
            <Route path="/add-new-project" element={<ProtectedRoute><Navigate to="/station/new-station/form/investment-department" replace /></ProtectedRoute>} />

            {/* All Stations Dashboard */}
            {/* All Stations Dashboard & Analytics */}
            <Route element={<ProtectedRoute><AllStationsDashboardLayout /></ProtectedRoute>}>
              <Route path="/all-stations-dashboard" element={<Dashboard />} />
              <Route path="/all-stations-analytics" element={<ExecutiveDashboard />} />
              <Route path="/all-stations-list" element={<AllStationsListPage />} />
              <Route path="/all-stations-departments" element={<DepartmentsPage />} />
              <Route path="/all-stations-tasks" element={<TasksPage />} />
              <Route path="/all-stations-reports" element={<ReportsPage />} />
              <Route path="/station/:stationId/analytics" element={<StationAnalyticsPage />} />
              <Route path="/all-stations-requests" element={<RequestPage />} />
              <Route path="/all-stations-under-review" element={<UnderReviewProjectsPage />} />
              <Route path="/all-stations-contact-ceo" element={<ComplaintContactForm />} />
              <Route path="/all-stations-users" element={<UsersPage />} />
              <Route path="/all-stations-activity-history" element={<ActivityHistoryPage />} />
              <Route path="/station/:stationId" element={<StationFormsPage />} />

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
          </Suspense>
        </BrowserRouter>
      </StationProvider>
    </AuthProvider>
  );
}

export default App;





