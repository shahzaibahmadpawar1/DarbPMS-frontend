# Frontend Build Script for cPanel Deployment
# Run this before uploading to cPanel

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "DARB PMS - Frontend Build for cPanel" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the frontend directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the frontend directory" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "Warning: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "Please update .env with your actual values and run this script again" -ForegroundColor Yellow
    exit 1
}

Write-Host "Step 1: Installing dependencies..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: npm install failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Building production bundle..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Upload all files from the 'dist' folder to cPanel public_html" -ForegroundColor White
Write-Host "2. Upload the '.htaccess' file to cPanel public_html" -ForegroundColor White
Write-Host "3. Test your deployment at: https://stg.pms.darbstations.com.sa/" -ForegroundColor White
Write-Host ""
Write-Host "Files to upload are in: $(Get-Location)\dist" -ForegroundColor Cyan
Write-Host ""
