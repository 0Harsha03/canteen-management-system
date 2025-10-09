# Quick Deploy Script - One Command Deployment!
Write-Host "🚀 Canteen Management System - Quick Deploy" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# Step 1: Login to Vercel
Write-Host "Step 1: Vercel Login" -ForegroundColor Yellow
Write-Host "🔐 Please authenticate with Vercel..." -ForegroundColor Cyan
vercel login

# Step 2: Deploy Backend
Write-Host "Step 2: Backend Deployment" -ForegroundColor Yellow
Set-Location "backend"
Write-Host "🚀 Deploying backend..." -ForegroundColor Green
vercel --prod

# Step 3: Deploy Frontend  
Write-Host "Step 3: Frontend Deployment" -ForegroundColor Yellow
Set-Location "../frontend-react"
Write-Host "🚀 Deploying frontend..." -ForegroundColor Green  
vercel --prod

Set-Location ".."
Write-Host "✅ Deployment Complete! Check the URLs above." -ForegroundColor Green