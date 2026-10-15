# PowerShell script to add missing getSessionOrgId import to all files that use it

$appDir = "c:\Users\imran\Documents\server\texttile-erp-2026\app"
$importLine = 'import { getSessionOrgId } from "@/lib/session";'

$files = Get-ChildItem -Path $appDir -Recurse -Include "*.ts","*.tsx" | Where-Object {
    $content = Get-Content $_.FullName -Raw
    ($content -match 'getSessionOrgId') -and ($content -notmatch 'import.*getSessionOrgId')
}

foreach ($file in $files) {
    Write-Host "Adding import to: $($file.FullName)"
    $content = Get-Content $file.FullName -Raw
    
    # Find the right place to insert - after the last import statement
    $lines = Get-Content $file.FullName
    $lastImportLine = -1
    $useServerLine = -1
    
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^\s*import ') {
            $lastImportLine = $i
        }
        if ($lines[$i] -match '"use server"' -or $lines[$i] -match "'use server'") {
            $useServerLine = $i
        }
    }
    
    if ($lastImportLine -ge 0) {
        # Insert after the last import
        $insertAt = $lastImportLine + 1
    } elseif ($useServerLine -ge 0) {
        # Insert after "use server" + blank line
        $insertAt = $useServerLine + 1
    } else {
        $insertAt = 0
    }
    
    $newLines = @()
    $newLines += $lines[0..($insertAt - 1)]
    $newLines += $importLine
    if ($insertAt -lt $lines.Count) {
        $newLines += $lines[$insertAt..($lines.Count - 1)]
    }
    
    $newLines | Set-Content $file.FullName -Encoding UTF8
}

Write-Host "`nDone! Fixed all files."
