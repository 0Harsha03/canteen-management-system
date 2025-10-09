# Canteen Management System - Automated Vercel Deployment Script
# Run this script to deploy both frontend and backend

Write-Host "🚀 Starting Canteen Management System Deployment..." -ForegroundColor Green
Write-Host "📋 This will deploy both frontend and backend to Vercel" -ForegroundColor Cyan

# Check if user is logged in to Vercel
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Yellow
vercel whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Not logged in to Vercel. Please run 'vercel login' first!" -ForegroundColor Red
    Write-Host "💡 Run: vercel login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Vercel authentication confirmed!" -ForegroundColor Green

# Deploy Backend
Write-Host "📡 Deploying Backend..." -ForegroundColor Cyan
Set-Location "backend"

Write-Host "⚙️ Setting up backend environment variables..." -ForegroundColor Yellow
vercel env add NODE_ENV production
vercel env add JWT_SECRET (Read-Host "Enter JWT Secret (any random string)")

$mongoUri = Read-Host "Enter MongoDB URI (leave empty to use default)"
if ($mongoUri) {
    vercel env add MONGODB_URI $mongoUri
} else {
    vercel env add MONGODB_URI "mongodb://localhost:27017/canteen-management"
}

Write-Host "🚀 Deploying backend to production..." -ForegroundColor Green
$backendUrl = vercel --prod --yes

Write-Host "✅ Backend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Backend URL: $backendUrl" -ForegroundColor Cyan

# Deploy Frontend
Write-Host "🎨 Deploying Frontend..." -ForegroundColor Cyan
Set-Location "../frontend-react"

Write-Host "⚙️ Setting up frontend environment variables..." -ForegroundColor Yellow
vercel env add VITE_API_URL "$backendUrl/api"

Write-Host "🚀 Deploying frontend to production..." -ForegroundColor Green
$frontendUrl = vercel --prod --yes

Write-Host "✅ Frontend deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Frontend URL: $frontendUrl" -ForegroundColor Cyan

# Summary
Write-Host ""
Write-Host "🎉 DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "🎨 Frontend: $frontendUrl" -ForegroundColor Cyan  
Write-Host "📡 Backend:  $backendUrl" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Your Canteen Management System is now live!" -ForegroundColor Green

# Return to root directory
Set-Location ".."