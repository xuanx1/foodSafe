# Food Establishment Inspection Data [Preview](https://xuanx1.github.io/foodSafe/multi-city-inspection-map.html)

An interactive web application that visualizes food establishment inspection data across four major US cities: Seattle, New York City, Chicago, and San Francisco.

## Features

### 🗺️ Interactive Map Visualization
- **Real-time marker loading** with adaptive performance based on zoom level
- **Risk-based color coding** for restaurant markers (High: Red, Medium: Orange, Low: Green)
- **Clustered markers** for better performance with large datasets
- **City-specific map views** with smooth transitions between cities

### 🏙️ Multi-City Support
- **Seattle** - King County food establishment inspection data
- **New York City** - DOHMH restaurant inspection results
- **Chicago** - City of Chicago food inspection records  
- **San Francisco** - SF health inspection scores

### 📊 Data Integration
- **Hybrid data sources**: Combines CSV files with live API feeds
- **Real-time updates** from city government APIs
- **Data deduplication** prioritizing API data over static CSV files
- **Spatial indexing** for fast geographic queries

### 🎛️ Advanced Filtering
- **Inspection Type** filtering (varies by city)
- **Grade/Result** filtering with city-specific grading systems
- **Risk Level** filtering with city-specific risk classifications
- **Date range** filtering for temporal analysis
- **Real-time statistics** showing filtered results

### 🎨 Professional UI/UX
- **Gotham font family** throughout the interface for consistency
- **City selector** with smooth transitions between locations
- **Progress indicators** for data loading and marker rendering
- **Responsive design** with semi-transparent overlay panels
- **Dynamic legends** that update based on current city context

## City-Specific Risk Classifications

### Seattle
- **High Risk**: 15+ violation points
- **Medium Risk**: 5-14 violation points  
- **Low Risk**: 0-4 violation points

### New York City
- **High Risk**: 28+ violation points (Grade C or worse)
- **Medium Risk**: 14-27 violation points (Grade B)
- **Low Risk**: 0-13 violation points (Grade A)

### Chicago
- **High Risk**: Risk 1 establishments
- **Medium Risk**: Risk 2 establishments
- **Low Risk**: Risk 3 establishments

### San Francisco
- **High Risk**: 10+ violations
- **Medium Risk**: 3-9 violations
- **Low Risk**: 0-2 violations

## Technical Architecture

### Frontend
- **D3.js v7** for data loading and CSV parsing
- **Leaflet.js v1.9.4** for interactive mapping
- **Vanilla JavaScript** with modern ES6+ features
- **Custom CSS** with backdrop filters and smooth animations

### Data Processing
- **Multi-format support**: CSV files and JSON APIs
- **Date normalization** across different city formats
- **Geographic validation** with coordinate verification
- **Performance optimization** with spatial indexing

### Performance Features
- **Adaptive marker loading** based on zoom level (up to 15,000 markers)
- **Debounced map events** to prevent excessive API calls
- **Progressive loading** with visual progress indicators
- **Memory management** with marker cleanup on city switches

## Data Sources

### Seattle
- **CSV**: `seattle-Food_Establishment_Inspection_Data.csv`
- **API**: King County Open Data Portal
- **Limit**: 10,000 records per API call

### New York City  
- **CSV**: `nyc-DOHMH_New_York_City_Restaurant_Inspection_Results.csv`
- **API**: NYC Open Data Portal (SODA 2.0)
- **Limit**: 50,000 records per API call

### Chicago
- **CSV**: `chicago-Food_Inspections.csv`
- **API**: Chicago Data Portal
- **Limit**: 50,000 records per API call

### San Francisco
- **CSV**: `sfo-Health_Inspection_Scores.csv`  
- **API**: SF Open Data Portal
- **Limit**: 50,000 records per API call

## Usage

1. **Select a city** using the bottom-right city selector or click the city title to cycle through cities
2. **Open settings panel** by clicking the "SETTINGS" button in the top-right
3. **Apply filters** to narrow down inspections by type, grade, risk level, or date range
4. **Click markers** to view detailed inspection information
5. **Use the legends** to understand risk classifications and grading systems

## File Structure
```
foodSafe/
├── multi-city-inspection-map.html     # Main application
├── seattle-Food_Establishment_Inspection_Data.csv
├── nyc-DOHMH_New_York_City_Restaurant_Inspection_Results.csv  
├── chicago-Food_Inspections.csv
├── sfo-Health_Inspection_Scores.csv
└── README.md
```

## Browser Compatibility
- Modern browsers with ES6+ support
- Chrome/Edge 88+, Firefox 85+, Safari 14+
- Requires JavaScript enabled
- Optimized for desktop and tablet viewing

---

*Data is filtered to show current year (2025) inspections only. API data is refreshed in real-time when available.*
