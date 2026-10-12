$ErrorActionPreference = "Stop"
$root = "c:\Users\Thommy Kane\OneDrive\Desktop\FTMAG\public\fall 2026"
$out = "c:\Users\Thommy Kane\OneDrive\Desktop\FTMAG\.tmp-fall2026-text"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$skip = @(
  "Excelsior Springs",
  "Lodi CA",
  "Ocean County",
  "Pearland TX",
  "Randolph County",
  "Rehoboth-Dewey",
  "Ridgeland",
  "Santa Fe",
  "South County",
  "Tifton",
  "Timeless Frenchlick",
  "Uvalde County"
)

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0

function Save-Doc($path, $destBase) {
  $doc = $word.Documents.Open($path, $false, $true)
  try {
    $text = $doc.Content.Text
    $links = @()
    foreach ($h in @($doc.Hyperlinks)) {
      if ($h.Address) { $links += $h.Address }
    }
    $header = ""
    if ($links.Count -gt 0) {
      $header = ($links | Select-Object -Unique | ForEach-Object { "LINK: $_" }) -join "`n"
      $header += "`n`n"
    }
    Set-Content -LiteralPath ($destBase + ".txt") -Value ($header + $text) -Encoding utf8
  } finally {
    $doc.Close($false) | Out-Null
  }
}

Get-ChildItem -LiteralPath $root -Directory | ForEach-Object {
  $name = $_.Name
  $skipThis = $false
  foreach ($s in $skip) { if ($name.StartsWith($s)) { $skipThis = $true } }
  if ($skipThis) { Write-Host "SKIP $name"; return }

  $safe = ($name -replace '[^A-Za-z0-9]+', '-').Trim('-')
  $ed = Join-Path $_.FullName "Editorial"
  $files = @()
  if (Test-Path -LiteralPath $ed) {
    $files = @(Get-ChildItem -LiteralPath $ed -File | Where-Object {
      $_.Extension -match '\.(docx|doc|pdf)$' -and $_.Name -notmatch 'PROOFED' -and $_.Name -notmatch '1500 Character|social|blurb|Links'
    })
    if ($files.Count -eq 0) {
      $files = @(Get-ChildItem -LiteralPath $ed -File | Where-Object {
        $_.Extension -match '\.(docx|doc|pdf)$' -and $_.Name -match 'PROOFED' -and $_.Name -notmatch '1500 Character|social|blurb'
      })
    }
  }
  $linkDocs = @()
  if (Test-Path -LiteralPath $ed) {
    $linkDocs = @(Get-ChildItem -LiteralPath $ed -File | Where-Object { $_.Name -match '^Links' -and $_.Extension -eq '.docx' })
  }
  $rootLinks = @(Get-ChildItem -LiteralPath $_.FullName -File | Where-Object { $_.Name -match 'URL' -and $_.Extension -eq '.docx' })

  if ($files.Count -eq 0 -and $linkDocs.Count -eq 0) {
    Write-Host "NO DOC $name"
    return
  }

  $i = 0
  foreach ($f in ($files + $linkDocs + $rootLinks)) {
    $dest = Join-Path $out "$safe"
    if ($i -gt 0) { $dest = Join-Path $out "$safe-$i" }
    Write-Host "READ $name :: $($f.Name)"
    Save-Doc $f.FullName $dest
    $i++
  }
}

$word.Quit() | Out-Null
Write-Host "DONE"
