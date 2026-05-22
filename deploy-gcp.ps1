# Google Cloud Run Deployment Script for Windows
# Ensure you have installed the Google Cloud SDK and run 'gcloud auth login' first.

$ProjectID = Read-Host "Masukkan GCP Project ID Anda"
if ([string]::IsNullOrEmpty($ProjectID)) {
    Write-Error "Project ID tidak boleh kosong."
    exit
}

$Region = Read-Host "Masukkan GCP Region [default: asia-southeast2]"
if ([string]::IsNullOrEmpty($Region)) {
    $Region = "asia-southeast2"
}

Write-Host "1. Mengatur project active ke $ProjectID..."
gcloud config set project $ProjectID

Write-Host "2. Mengaktifkan API yang dibutuhkan (Artifact Registry & Cloud Run)..."
gcloud services enable artifactregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com

Write-Host "3. Membuat repository di Artifact Registry..."
# Check if repo exists, if not create it
$RepoCheck = gcloud artifacts repositories describe repeat-repo --location=$Region 2>$null
if (-not $RepoCheck) {
    gcloud artifacts repositories create repeat-repo `
        --repository-format=docker `
        --location=$Region `
        --description="Docker repository untuk Repeat App"
}

Write-Host "4. Menjalankan Next.js build statis..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build Next.js gagal."
    exit
}

Write-Host "5. Membangun container image via Google Cloud Build (tidak perlu Docker lokal)..."
$ImageTag = "$Region-docker.pkg.dev/$ProjectID/repeat-repo/repeat-app:latest"
gcloud builds submit --tag $ImageTag
if ($LASTEXITCODE -ne 0) {
    Write-Error "Google Cloud Build gagal."
    exit
}

Write-Host "6. Mendeploy ke Google Cloud Run..."
gcloud run deploy repeat-app `
    --image $ImageTag `
    --platform managed `
    --allow-unauthenticated `
    --region $Region

Write-Host "Proses deployment selesai!"
