# Backend Testing Script
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TRIVO BACKEND TESTING SUITE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"
$results = @()

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "  [PASS] $Name" -ForegroundColor Green
        $script:results += @{ Name = $Name; Status = "PASS" }
        return $response
    }
    catch {
        Write-Host "  [FAIL] $Name - $($_.Exception.Message)" -ForegroundColor Red
        $script:results += @{ Name = $Name; Status = "FAIL"; Error = $_.Exception.Message }
        return $null
    }
}

# Test 1: Server Health
Write-Host "`n=== SERVER HEALTH ===" -ForegroundColor Cyan
Test-Endpoint -Name "Server Health Check" -Url "$baseUrl/"

# Test 2: Crop System
Write-Host "`n=== CROP SYSTEM ===" -ForegroundColor Cyan
$crops = Test-Endpoint -Name "Get All Crops" -Url "$baseUrl/api/crops/crops"
if ($crops) {
    Write-Host "  Found $($crops.count) crops" -ForegroundColor Gray
}

$recommendations = Test-Endpoint -Name "Crop Recommendations" -Url "$baseUrl/api/crops/recommendations?rainfall=1200&temperature=25&soilType=Black&limit=5"
if ($recommendations) {
    $topCrop = $recommendations.data.recommendations[0]
    Write-Host "  Top recommendation: $($topCrop.crop.name) (Score: $($topCrop.suitability.score))" -ForegroundColor Gray
}

$regionRec = Test-Endpoint -Name "Region Recommendations (Pune)" -Url "$baseUrl/api/crops/region?regionName=Pune"

# Test 3: Email Service
Write-Host "`n=== EMAIL SERVICE ===" -ForegroundColor Cyan
$emailBody = @{
    email = "shreshtajunjuru@gmail.com"
    name = "Shreshta Junjuru"
}
$emailResult = Test-Endpoint -Name "Send Test Email" -Url "$baseUrl/api/test/email" -Method "POST" -Body $emailBody
if ($emailResult) {
    Write-Host "  Email sent to: shreshtajunjuru@gmail.com" -ForegroundColor Gray
    Write-Host "  Message ID: $($emailResult.messageId)" -ForegroundColor Gray
}

# Test 4: User Registration
Write-Host "`n=== USER SYSTEM ===" -ForegroundColor Cyan
$userBody = @{
    name = "Test User - Backend Verification"
    email = "testuser_$(Get-Random)@trivoo.com"
    password = "securepass123"
    profession = "System Admin"
}
$userResult = Test-Endpoint -Name "User Registration" -Url "$baseUrl/api/users/register" -Method "POST" -Body $userBody
if ($userResult) {
    Write-Host "  User created: $($userResult.user.email)" -ForegroundColor Gray
    Write-Host "  Profession: $($userResult.user.profession)" -ForegroundColor Gray
}

# Test 5: Database Test
Write-Host "`n=== DATABASE ===" -ForegroundColor Cyan
$dbTest = Test-Endpoint -Name "Database Connection" -Url "$baseUrl/api/test/database"
if ($dbTest) {
    Write-Host "  Status: $($dbTest.database.status)" -ForegroundColor Gray
    Write-Host "  Database: $($dbTest.database.name)" -ForegroundColor Gray
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAIL" }).Count

Write-Host "Total Tests: $($results.Count)" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor $(if ($failed -gt 0) { "Red" } else { "Green" })

Write-Host "`n========================================`n" -ForegroundColor Cyan

# Detailed Results
Write-Host "DETAILED RESULTS:`n" -ForegroundColor Cyan
foreach ($result in $results) {
    $color = if ($result.Status -eq "PASS") { "Green" } else { "Red" }
    Write-Host "  [$($result.Status)] $($result.Name)" -ForegroundColor $color
    if ($result.Error) {
        Write-Host "    Error: $($result.Error)" -ForegroundColor Gray
    }
}

Write-Host ""
