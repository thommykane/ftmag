$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$root = (Get-Location).Path
$out = Join-Path $root ".tmp-spring-summer-2025-text"
New-Item -ItemType Directory -Force -Path $out | Out-Null

$jobs = @(
  @("spring 25", "Cherokee, GA (Completed)", "cherokee"),
  @("spring 25", "Chinqateague (Completed)", "chincoteague"),
  @("spring 25", "Jefferson County (Completed)", "jefferson-county"),
  @("spring 25", "New Bedford (Completed)", "new-bedford"),
  @("spring 25", "Peachtree (Completed)", "peachtree-city"),
  @("spring 25", "Wichita Falls (completed)", "wichita-falls"),
  @("summer 25", "Mobile (Completed)", "mobile"),
  @("summer 25", "The Palm Beaches (Completed)", "palm-beaches")
)

function Decode-Xml([string]$xml) {
  $t = $xml -replace '<w:tab/>', ' ' -replace '<w:br/>', "`n" -replace '</w:p>', "`n"
  $t = [regex]::Replace($t, '<[^>]+>', '')
  $t = $t -replace '&amp;', '&' -replace '&lt;', '<' -replace '&gt;', '>' -replace '&quot;', '"' -replace '&apos;', "'"
  return $t.Trim()
}

foreach ($job in $jobs) {
  $folder = Join-Path $root ("public\" + $job[0] + "\" + $job[1])
  $ed = Get-ChildItem -LiteralPath $folder -Directory | Where-Object { $_.Name -match 'editorial' } | Select-Object -First 1
  $files = Get-ChildItem -LiteralPath $ed.FullName -Filter *.docx
  $proof = $files | Where-Object { $_.Name -match 'PROOFED' } | Select-Object -First 1
  if (-not $proof) { $proof = $files | Select-Object -First 1 }
  $zip = [System.IO.Compression.ZipFile]::OpenRead($proof.FullName)
  try {
    $doc = $zip.GetEntry("word/document.xml")
    $sr = New-Object System.IO.StreamReader($doc.Open())
    $xml = $sr.ReadToEnd()
    $sr.Close()
    $text = Decode-Xml $xml
    $urls = @()
    $rels = $zip.GetEntry("word/_rels/document.xml.rels")
    if ($rels) {
      $sr2 = New-Object System.IO.StreamReader($rels.Open())
      $relsXml = $sr2.ReadToEnd()
      $sr2.Close()
      [regex]::Matches($relsXml, 'Target="(https?://[^"]+)"') | ForEach-Object { $urls += $_.Groups[1].Value }
    }
  } finally { $zip.Dispose() }
  $body = $text + "`n`n---URLS---`n" + ($urls -join "`n") + "`n"
  $dest = Join-Path $out ($job[2] + ".txt")
  [System.IO.File]::WriteAllText($dest, $body)
  Write-Output ("{0} | {1} | chars {2} | urls {3}" -f $job[2], $proof.Name, $text.Length, $urls.Count)
}
