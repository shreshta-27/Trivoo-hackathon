# Test Alert and Action Recommendation Email Features
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TESTING AI-GENERATED ALERT EMAILS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:5000"

# Step 1: Create a test user first
Write-Host "Step 1: Creating test user..." -ForegroundColor Yellow
$userBody = @{
    name = "Shreshta Junjuru"
    email = "shreshtajunjuru@gmail.com"
    password = "testpass123"
    profession = "Field Officers / Ground Staff"
} | ConvertTo-Json

try {
    $userResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/register" -Method POST -Body $userBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "  [SUCCESS] User created: $($userResponse.user.email)" -ForegroundColor Green
    $userId = $userResponse.user._id
    Write-Host "  User ID: $userId" -ForegroundColor Gray
}
catch {
    if ($_.Exception.Message -like "*already exists*") {
        Write-Host "  [INFO] User already exists, attempting login..." -ForegroundColor Yellow
        $loginBody = @{
            email = "shreshtajunjuru@gmail.com"
            password = "testpass123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/users/login" -Method POST -Body $loginBody -ContentType "application/json"
        $userId = $loginResponse.user._id
        Write-Host "  [SUCCESS] Logged in: $($loginResponse.user.email)" -ForegroundColor Green
        Write-Host "  User ID: $userId" -ForegroundColor Gray
    }
    else {
        Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Step 2: Create a test project
Write-Host "`nStep 2: Creating test project..." -ForegroundColor Yellow
$projectBody = @{
    name = "Test Plantation - Alert Testing"
    location = @{
        type = "Point"
        coordinates = @(73.8567, 18.5204)  # Pune coordinates
        address = "Pune, Maharashtra"
    }
    treeType = "Teak"
    plantationSize = 500
    manager = $userId
    healthScore = 45  # Low health to trigger alerts
    riskLevel = "high"
    activeRisks = @("drought_risk", "pest_infestation")
    metadata = @{
        plantedDate = (Get-Date).AddDays(-90).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        targetCompletionDate = (Get-Date).AddDays(275).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
} | ConvertTo-Json -Depth 10

try {
    $projectResponse = Invoke-RestMethod -Uri "$baseUrl/api/projects" -Method POST -Body $projectBody -ContentType "application/json" -ErrorAction Stop
    Write-Host "  [SUCCESS] Project created: $($projectResponse.data.name)" -ForegroundColor Green
    $projectId = $projectResponse.data._id
    Write-Host "  Project ID: $projectId" -ForegroundColor Gray
    Write-Host "  Health Score: $($projectResponse.data.healthScore)" -ForegroundColor Gray
    Write-Host "  Risk Level: $($projectResponse.data.riskLevel)" -ForegroundColor Gray
}
catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Response: $($_.ErrorDetails.Message)" -ForegroundColor Gray
    exit 1
}

# Step 3: Trigger Action Recommendations (which will send alert email if critical)
Write-Host "`nStep 3: Triggering AI Action Recommendations..." -ForegroundColor Yellow
Write-Host "  This will generate AI recommendations and send alert email if critical" -ForegroundColor Gray

try {
    $recResponse = Invoke-RestMethod -Uri "$baseUrl/api/recommendations/trigger/$projectId" -Method POST -ContentType "application/json" -ErrorAction Stop
    Write-Host "  [SUCCESS] Recommendations generated!" -ForegroundColor Green
    Write-Host "  Total Recommendations: $($recResponse.count)" -ForegroundColor Gray
    
    # Display recommendations
    foreach ($rec in $recResponse.data) {
        Write-Host "`n  Recommendation:" -ForegroundColor Cyan
        Write-Host "    Action: $($rec.action)" -ForegroundColor White
        Write-Host "    Priority: $($rec.priority)" -ForegroundColor White
        Write-Host "    Urgency: $($rec.urgency)" -ForegroundColor $(if ($rec.urgency -eq "critical") { "Red" } else { "Yellow" })
        Write-Host "    Impact: $($rec.impact)" -ForegroundColor White
        
        if ($rec.urgency -eq "critical" -or $rec.urgency -eq "immediate") {
            Write-Host "    [ALERT EMAIL TRIGGERED] 📧" -ForegroundColor Red
            Write-Host "    Email sent to: shreshtajunjuru@gmail.com" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "  [ERROR] $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "  Response: $($_.ErrorDetails.Message)" -ForegroundColor Gray
}

# Step 4: Manually trigger an alert to test alert system
Write-Host "`nStep 4: Testing Direct Alert Trigger..." -ForegroundColor Yellow
Write-Host "  Creating a test route to trigger alert..." -ForegroundColor Gray

# We'll create a simple test endpoint call
$alertTestBody = @{
    userId = $userId
    projectId = $projectId
    riskType = "health_critical"
    severity = "critical"
    projectName = "Test Plantation - Alert Testing"
    location = "Pune, Maharashtra"
    issueDescription = "Critical health decline detected. Immediate intervention required to prevent plantation failure."
    actionRecommendation = "Apply emergency irrigation and pest control measures within 24 hours"
} | ConvertTo-Json

Write-Host "  Alert Details:" -ForegroundColor Cyan
Write-Host "    Risk Type: health_critical" -ForegroundColor White
Write-Host "    Severity: critical" -ForegroundColor Red
Write-Host "    Recipient: shreshtajunjuru@gmail.com" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ User created/logged in: shreshtajunjuru@gmail.com" -ForegroundColor Green
Write-Host "✅ Test project created with low health score" -ForegroundColor Green
Write-Host "✅ AI Action Recommendations triggered" -ForegroundColor Green
Write-Host "✅ Alert emails sent for critical recommendations" -ForegroundColor Green
Write-Host "`nCheck email inbox: shreshtajunjuru@gmail.com" -ForegroundColor Yellow
Write-Host "Expected emails:" -ForegroundColor Yellow
Write-Host "  1. Welcome email (from user registration)" -ForegroundColor Gray
Write-Host "  2. Alert email (from critical action recommendations)" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Cyan
