param(
  [string]$DestinationFolder,
  [switch]$IncludeNodeModules
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function New-Backup {
  param(
    [string]$RepoRoot,
    [string]$DestinationFolder,
    [bool]$IncludeNodeModules
  )

  $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
  $backupName = "fincontrol-backup-$timestamp.zip"
  $destinationPath = Join-Path (Resolve-Path $DestinationFolder) $backupName
  $tempDir = Join-Path $env:TEMP "fincontrol-backup-$timestamp"

  if (-not (Test-Path $DestinationFolder)) {
    New-Item -ItemType Directory -Path $DestinationFolder | Out-Null
  }

  if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
  }
  New-Item -ItemType Directory -Path $tempDir | Out-Null

  $excludeDirs = @('.git', '.idea', '.vscode', '.windsurf', 'backups', 'dist', 'backend\dist', 'backend\logs')
  if (-not $IncludeNodeModules) {
    $excludeDirs += @('node_modules', 'backend\node_modules')
  }

  $robocopyArgs = @(
    $RepoRoot,
    $tempDir,
    '/MIR',
    '/NFL', '/NDL', '/NJH', '/NJS', '/NC', '/NS'
  )

  foreach ($dir in $excludeDirs) {
    $fullPath = Join-Path $RepoRoot $dir
    if (Test-Path $fullPath) {
      $robocopyArgs += '/XD'
      $robocopyArgs += $fullPath
    }
  }

  Write-Host "[INFO] Copiando arquivos para área temporária..."
  $null = & robocopy @robocopyArgs
  $robocopyExit = $LASTEXITCODE
  if ($robocopyExit -gt 7) {
    throw "Robocopy falhou com código $robocopyExit"
  }

  if (Test-Path $destinationPath) {
    Remove-Item $destinationPath -Force
  }

  Write-Host "[INFO] Compactando backup em $destinationPath ..."
  Compress-Archive -Path "$tempDir\*" -DestinationPath $destinationPath -CompressionLevel Optimal

  Write-Host "[INFO] Limpando arquivos temporários..."
  Remove-Item $tempDir -Recurse -Force

  Write-Host "[OK] Backup criado: $destinationPath"
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

if (-not $DestinationFolder) {
  $DestinationFolder = Join-Path $repoRoot 'backups'
}

if (-not (Test-Path $DestinationFolder)) {
  New-Item -ItemType Directory -Path $DestinationFolder | Out-Null
}

$resolvedDestination = (Resolve-Path $DestinationFolder).Path

New-Backup -RepoRoot $repoRoot -DestinationFolder $resolvedDestination -IncludeNodeModules:$IncludeNodeModules.IsPresent
