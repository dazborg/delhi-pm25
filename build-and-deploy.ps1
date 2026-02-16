$env:Path = "C:\Program Files\nodejs;" + [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path','User')
Set-Location "C:\Users\hilli\delhi-pm25"

Write-Host "=== Building project ===" -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "BUILD FAILED" -ForegroundColor Red
    exit 1
}
Write-Host "=== Build successful ===" -ForegroundColor Green

Write-Host ""
Write-Host "=== Initializing git repo ===" -ForegroundColor Cyan
git init -b main
git add -A
git commit -m "Initial commit: Delhi PM2.5 Air Quality Analysis website

Interactive dashboard analyzing how different pollution sources affect PM2.5
levels in Delhi, with health impact modelling and technical reports.

- Next.js 16 static export with Recharts v3 visualizations
- Source apportionment toggles with real-time health impact calculations
- MDX-based systematic reviews and methodology documentation
- GitHub Pages deployment via Actions workflow"

Write-Host ""
Write-Host "=== Creating private GitHub repo ===" -ForegroundColor Cyan
gh repo create delhi-pm25 --private --source=. --remote=origin --push

Write-Host ""
Write-Host "=== Enabling GitHub Pages ===" -ForegroundColor Cyan
gh api -X PUT "repos/dazborg/delhi-pm25/pages" -f "build_type=workflow" 2>&1

Write-Host ""
Write-Host "=== Done! ===" -ForegroundColor Green
Write-Host "Repo: https://github.com/dazborg/delhi-pm25"
Write-Host "Site will be live at: https://dazborg.github.io/delhi-pm25/"
