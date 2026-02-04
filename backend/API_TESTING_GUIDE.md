# Crop Recommendation API Testing Guide

## Available Endpoints

### 1. Get All Crops
```
GET /api/crops/crops
```
Returns all 10 crops in the database with full details.

### 2. Get Crop Recommendations
```
GET /api/crops/recommendations?rainfall=1200&temperature=25&soilType=Black&limit=5
```
**Parameters:**
- `rainfall` (required): Annual rainfall in mm
- `temperature` (required): Average temperature in °C
- `soilType` (optional): Soil type (Loamy, Black, Sandy, Clay, Red, Alluvial, Laterite)
- `limit` (optional): Number of recommendations (default: 10)
- `minScore` (optional): Minimum suitability score (default: 0)

### 3. Get Region-Based Recommendations
```
GET /api/crops/region?regionName=Pune
```
**Available Regions:**
- Pune (722mm, 25°C, Black soil)
- Nashik (565mm, 27°C, Black soil)
- Mumbai (2167mm, 27°C, Laterite soil)
- Nagpur (1067mm, 28°C, Black soil)
- Aurangabad (726mm, 26°C, Black soil)
- Kolhapur (1200mm, 24°C, Laterite soil)
- Satara (1200mm, 23°C, Red soil)
- Ratnagiri (3000mm, 26°C, Laterite soil)
- Thane (2500mm, 27°C, Laterite soil)
- Solapur (545mm, 28°C, Black soil)

### 4. Get Crop by ID
```
GET /api/crops/crops/:id
```

### 5. Compare Crops
```
POST /api/crops/compare
Content-Type: application/json

{
  "cropIds": ["crop_id_1", "crop_id_2"],
  "rainfall": 1200,
  "temperature": 25,
  "soilType": "Black"
}
```

## Test Examples

### Example 1: Dry Region (Nashik)
```bash
curl "http://localhost:5000/api/crops/region?regionName=Nashik"
```
**Expected Top Recommendations:**
1. Neem (Very hardy, low water requirement)
2. Bamboo (Adaptable)
3. Arjun (Climate-resilient)

### Example 2: High Rainfall Region (Mumbai)
```bash
curl "http://localhost:5000/api/crops/region?regionName=Mumbai"
```
**Expected Top Recommendations:**
1. Bamboo (Thrives in high rainfall)
2. Jamun (Good for wet conditions)
3. Arjun (Riverbank specialist)

### Example 3: Moderate Climate (Pune)
```bash
curl "http://localhost:5000/api/crops/region?regionName=Pune"
```
**Expected Top Recommendations:**
1. Bamboo (Versatile)
2. Neem (Hardy)
3. Teak (Good conditions)

## Response Format

```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "crop": {
          "id": "...",
          "name": "Bamboo",
          "priority": 1,
          "description": "...",
          "characteristics": {
            "growthRate": "Very Fast",
            "survivalRate": "Very High",
            "maintenanceLevel": "Very Low",
            "economicValue": "High"
          }
        },
        "suitability": {
          "score": 95,
          "category": "Excellent",
          "reasons": [...],
          "warnings": []
        },
        "environmentalMatch": {
          "rainfall": "optimal",
          "temperature": "optimal",
          "soil": true
        },
        "riskAssessment": {
          "overall": "Low",
          "factors": {...}
        }
      }
    ],
    "totalCropsAnalyzed": 10,
    "suitableCrops": 5,
    "summary": {...}
  }
}
```

## How the Recommendation Engine Works

### Rule-Based Scoring System

1. **Base Score**: 100 points

2. **Rainfall Matching**:
   - Within range: +0 penalty
   - Below minimum: Up to -40 points
   - Above maximum: Up to -30 points

3. **Temperature Matching**:
   - Within range: +0 penalty
   - Outside range: Up to -35 points

4. **Soil Compatibility**:
   - Compatible: +0 penalty
   - Incompatible: -25 points

5. **Risk Factors**:
   - Additional penalties based on crop-specific vulnerabilities

### Score Categories
- **90-100**: Excellent
- **65-89**: Good
- **50-64**: Moderate
- **35-49**: Poor
- **0-34**: Not Recommended

## Database Schema

### Crop Model Fields
- `name`: Crop name
- `scientificName`: Scientific name
- `priority`: 1-10 (1 = highest priority)
- `description`: Detailed description
- `characteristics`: Growth rate, survival rate, maintenance, economic value
- `environmentalRequirements`: Rainfall, temperature, soil types, water requirement
- `plantationDetails`: Growth time, spacing, ideal seasons
- `benefits`: Ecological, economic, social
- `riskFactors`: Drought, fire, pest, disease sensitivity
- `useCases`: Government projects, CSR, agroforestry, etc.

## Seeded Crops (Priority Order)

1. **Bamboo** - Fastest growth, perfect for government projects
2. **Neem** - Extremely hardy, works in dry zones
3. **Teak** - High economic value, long-term forestry
4. **Sal** - Native restoration, climate-specific
5. **Jamun** - Agroforestry compatible, community benefits
6. **Arjun** - Soil stabilization, climate-resilient
7. **Mahua** - Tribal livelihood integration
8. **Mango** - Agroforestry, requires maintenance
9. **Peepal** - Ecologically strong, limited scalability
10. **Banyan** - Symbolic, not for mass plantation
