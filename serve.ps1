# Refah Man - tiny local web server (Windows, no install needed)
# Serves the prebuilt app in .\dist on http://localhost:5180
$ErrorActionPreference = 'Stop'
$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'dist'))
if (-not (Test-Path (Join-Path $root 'index.html'))) {
  Write-Host "dist\index.html not found. Run 'npm install' and 'npm run build' first." -ForegroundColor Red
  Read-Host 'Press Enter to exit'
  exit 1
}

$mime = @{
  '.html' = 'text/html; charset=utf-8'; '.js' = 'text/javascript; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'
  '.woff2' = 'font/woff2'; '.woff' = 'font/woff'; '.json' = 'application/json'; '.txt' = 'text/plain; charset=utf-8'
}

$listener = $null
foreach ($port in 5180..5190) {
  try {
    $l = New-Object System.Net.HttpListener
    $l.Prefixes.Add("http://localhost:$port/")
    $l.Start()
    $listener = $l
    break
  } catch { }
}
if (-not $listener) { Write-Host 'No free port between 5180 and 5190.' -ForegroundColor Red; Read-Host 'Press Enter to exit'; exit 1 }

$url = $listener.Prefixes | Select-Object -First 1
Write-Host ''
Write-Host "  Refah Man is running at $url" -ForegroundColor Green
Write-Host '  Login: username 1111 / password 1111 (all codes are 1111)'
Write-Host '  Close this window to stop.'
Write-Host ''
Start-Process $url

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $res = $ctx.Response
  try {
    $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
    if ($rel -eq '') { $rel = 'index.html' }
    $full = [IO.Path]::GetFullPath((Join-Path $root $rel))
    if (-not $full.StartsWith($root) -or -not (Test-Path -LiteralPath $full -PathType Leaf)) {
      if ([IO.Path]::GetExtension($rel)) { $res.StatusCode = 404; $res.Close(); continue }
      $full = Join-Path $root 'index.html'
    }
    $ext = [IO.Path]::GetExtension($full).ToLower()
    $res.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
    $bytes = [IO.File]::ReadAllBytes($full)
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
  } catch {
    $res.StatusCode = 500
  } finally {
    $res.Close()
  }
}
