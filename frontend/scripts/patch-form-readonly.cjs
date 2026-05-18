const fs = require('fs');
const path = require('path');

const formsDir = path.join(__dirname, '../src/app/components/forms');

const mapping = {
  'StationInformationForm.tsx': 'station-information',
  'CamerasForm.tsx': 'cameras',
  'DispensersForm.tsx': 'dispensers',
  'NozzlesForm.tsx': 'nozzles',
  'TanksForm.tsx': 'tanks',
  'AreasForm.tsx': 'areas',
  'OwnerInformationForm.tsx': 'owner-information',
  'DeedInformationForm.tsx': 'deed-information',
  'BuildingPermitForm.tsx': 'building-permit',
  'ContractForm.tsx': 'contract',
  'CommercialLicenseForm.tsx': 'commercial-license',
  'SalamahLicenseForm.tsx': 'salamah-license',
  'TaqyeesLicenseForm.tsx': 'taqyees-license',
  'EnvironmentalLicenseForm.tsx': 'environmental-license',
  'GovernmentLicenseAttachmentsPage.tsx': 'government-license-attachments',
  'SurveyReportForm.tsx': 'survey-report',
  'FixedAssetsForm.tsx': 'fixed-assets',
  'EnergyLicenseForm.tsx': 'energy-license',
  'InvestmentForm.tsx': 'investment',
  'ProjectsForm.tsx': 'projects',
  'FranchiseManagementForm.tsx': 'franchise-management',
  'GenericDepartmentForm.tsx': null, // skip - used with different paths
  'ProcurementDepartmentForm.tsx': 'procurement',
  'OperationsManagementForm.tsx': 'operations-management',
  'PropertyManagementForm.tsx': 'property-management',
  'ArchitecturalDesignForm.tsx': 'architectural-design',
  'ConsultationOfficeForm.tsx': 'consultation-office',
  'StationTypeForm.tsx': 'station-type',
  'StationStatusForm.tsx': 'station-status',
};

for (const [file, formPath] of Object.entries(mapping)) {
  if (!formPath) continue;
  const fp = path.join(formsDir, file);
  if (!fs.existsSync(fp)) {
    console.log('skip missing', file);
    continue;
  }
  let c = fs.readFileSync(fp, 'utf8');
  if (c.includes('useStationFormReadOnly')) {
    console.log('already patched', file);
    continue;
  }

  if (!c.includes('useStationFormReadOnly')) {
    c = c.replace(
      /import \{ useStation \} from ["']\.\.\/\.\.\/context\/StationContext["'];/,
      `import { useStation } from "../../context/StationContext";\nimport { useStationFormReadOnly } from "../../hooks/useStationFormReadOnly";`,
    );
  }

  if (file === 'ContractForm.tsx') {
    c = c.replace(
      /const isReadOnly = accessMode === ['"]view-only['"] \|\| previewMode;/,
      `const isReadOnly = useStationFormReadOnly('contract') || previewMode;`,
    );
    // remove accessMode from destructure if only used for isReadOnly
    c = c.replace(/const \{ accessMode, selectedStation \}/, 'const { selectedStation }');
  } else {
    c = c.replace(
      /const \{ accessMode(?:, [^}]+)? \} = useStation\(\);\s*\n\s*const isReadOnly = accessMode === ['"]view-only['"];/,
      (match) => {
        const hasOther = match.includes('selectedStation') || match.includes('investmentProjectData');
        if (hasOther) {
          const destructure = match.match(/const \{([^}]+)\}/)[1];
          const kept = destructure.split(',').map((s) => s.trim()).filter((s) => s !== 'accessMode').join(', ');
          return `const { ${kept} } = useStation();\n  const isReadOnly = useStationFormReadOnly('${formPath}');`;
        }
        return `const isReadOnly = useStationFormReadOnly('${formPath}');`;
      },
    );
    // simple case without other fields
    c = c.replace(
      /const \{ accessMode \} = useStation\(\);\s*\n\s*const isReadOnly = accessMode === ['"]view-only['"];/,
      `const isReadOnly = useStationFormReadOnly('${formPath}');`,
    );
  }

  fs.writeFileSync(fp, c);
  console.log('patched', file);
}
