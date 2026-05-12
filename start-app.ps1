$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$nodeRoot = Join-Path $projectRoot ".tools\node"
$npm = Join-Path $nodeRoot "npm.cmd"

if (-not (Test-Path $npm)) {
  throw "Node portatil nao encontrado em .tools\node. Reinstale as dependencias antes de iniciar o app."
}

$env:Path = "$nodeRoot;$env:Path"
Set-Location $projectRoot

& $npm run start
