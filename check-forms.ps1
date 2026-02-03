$formsToUpdate = @(
    "OwnerInformationForm",
    "DeedInformationForm",
    "ContractForm",
    "CommercialLicenseForm",
    "SalamahLicenseForm",
    "TaqyeesLicenseForm",
    "EnvironmentalLicenseForm",
    "EnergyLicenseForm",
    "InvestmentForm",
    "ProjectsForm",
    "OperationsManagementForm",
    "FranchiseManagementForm",
    "PropertyManagementForm",
    "QualityManagementForm",
    "ProcurementDepartmentForm",
    "MaintenanceDepartmentForm",
    "LegalDepartmentForm",
    "MarketingDepartmentForm",
    "GovernmentRelationsDepartmentForm",
    "ITManagementForm",
    "HumanResourceForm",
    "FinanceForm",
    "SafetyForm",
    "CertificatesForm",
    "FixedAssetsForm"
)

$formsDir = "e:\Azhar Ali Buttar\projects\DarbStation\project management app\DARB Phase 1 Frontend\src\app\components\forms"

Write-Host "Forms that need single-station mode updates:" -ForegroundColor Cyan
$formsToUpdate | ForEach-Object {
    $formPath = Join-Path $formsDir "$_.tsx"
    if (Test-Path $formPath) {
        Write-Host "  ✓ $_" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $_ (not found)" -ForegroundColor Red
    }
}

Write-Host "`nTotal forms to update: $($formsToUpdate.Count)" -ForegroundColor Yellow
