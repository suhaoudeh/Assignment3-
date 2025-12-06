# Run E2E Tests Script

# Start backend server
Write-Host "Starting backend server..."
$serverPath = "c:\Users\suhao\OneDrive\Desktop\Software Eng-3rd semester\WebApp\Assignment3\comp229-f25-Portfolio\comp229-f25-Portfolio-\server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverPath'; node index.js"
Start-Sleep -Seconds 3

# Start frontend dev server
Write-Host "Starting frontend server..."
$clientPath = "c:\Users\suhao\OneDrive\Desktop\Software Eng-3rd semester\WebApp\Assignment3\comp229-f25-Portfolio\comp229-f25-Portfolio-\client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$clientPath'; npm run dev"
Start-Sleep -Seconds 5

# Run Cypress tests
Write-Host "Running Cypress tests..."
Set-Location $clientPath
npx cypress run

Write-Host "Tests completed! Check client/cypress/videos for recordings."
