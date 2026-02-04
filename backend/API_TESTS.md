# Trivo Authentication API Test Commands

## 1. Register a New User
curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"john@trivo.com\",\"password\":\"test123\",\"profession\":\"ngo\"}"

## 2. Login User
curl -X POST http://localhost:5000/api/users/login -H "Content-Type: application/json" -d "{\"email\":\"john@trivo.com\",\"password\":\"test123\"}"

## 3. Get User Profile (Replace YOUR_TOKEN with the token from login response)
curl -X GET http://localhost:5000/api/users/profile -H "Authorization: Bearer YOUR_TOKEN"

## 4. Update User Profile (Replace YOUR_TOKEN with the token from login response)
curl -X PUT http://localhost:5000/api/users/profile -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" -d "{\"name\":\"John Updated\"}"

## 5. Get All Users (Replace YOUR_TOKEN with the token from login response)
curl -X GET http://localhost:5000/api/users -H "Authorization: Bearer YOUR_TOKEN"

## Register Forest Officer
curl -X POST http://localhost:5000/api/users/register -H "Content-Type: application/json" -d "{\"name\":\"Jane Smith\",\"email\":\"jane@trivo.com\",\"password\":\"test123\",\"profession\":\"forest officer\"}"
