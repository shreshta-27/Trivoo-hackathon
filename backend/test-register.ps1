$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    name = "Test User"
    email = "test@trivo.com"
    password = "test123"
    profession = "ngo"
} | ConvertTo-Json

Write-Host "Testing User Registration..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/users/register" -Method Post -Headers $headers -Body $body
    Write-Host "SUCCESS! User registered:" -ForegroundColor Green
    Write-Host "Name: $($response.name)" -ForegroundColor Yellow
    Write-Host "Email: $($response.email)" -ForegroundColor Yellow
    Write-Host "Profession: $($response.profession)" -ForegroundColor Yellow
    Write-Host "Token: $($response.token.Substring(0,20))..." -ForegroundColor Yellow
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
