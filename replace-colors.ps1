# Replace all blue/purple hex codes with orange in all TSX files
$files = Get-ChildItem -Path "src" -Filter "*.tsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Replace hex codes
    $content = $content -replace '#6366f1', '#f97316'  # indigo-500 -> orange-500
    $content = $content -replace '#818cf8', '#fb923c'  # indigo-400 -> orange-400
    $content = $content -replace '#4f46e5', '#ea580c'  # indigo-600 -> orange-600
    $content = $content -replace '#3b82f6', '#f97316'  # blue-500 -> orange-500
    $content = $content -replace '#60a5fa', '#fb923c'  # blue-400 -> orange-400
    $content = $content -replace '#2563eb', '#ea580c'  # blue-600 -> orange-600
    $content = $content -replace '#8b5cf6', '#f97316'  # violet-500 -> orange-500
    $content = $content -replace '#a78bfa', '#fb923c'  # violet-400 -> orange-400
    $content = $content -replace '#7c3aed', '#ea580c'  # violet-600 -> orange-600
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
}

Write-Host "Color replacement complete!"
