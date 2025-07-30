# Sahyadri Guardian

A comprehensive trekking and fort exploration application for the Sahyadri mountain range in Maharashtra, India.

## Features

- **Interactive Fort Tours**: Explore historical forts with guided tours
- **Trekking Directions**: Get detailed routes and directions to trekking locations
- **Street View Integration**: View real locations using Google Street View
- **Weather Information**: Real-time weather data for trekking locations
- **Hazard Reporting**: Report and track trail hazards
- **3D Map Visualization**: Advanced 3D mapping for better navigation
- **User Authentication**: Secure login and registration system

## Interactive Tour Setup

The interactive tour feature requires a Google Maps API key with the following APIs enabled:
- Maps JavaScript API
- Street View API

### Environment Variables

Create a `.env` file in the project root with:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Getting a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Maps JavaScript API" and "Street View API"
4. Go to "APIs & Services > Credentials"
5. Create an API key
6. (Optional) Restrict the key to your domain for production

### Using the Interactive Tour

1. Select a fort from the trail selector
2. Click the "Tour" button to start the interactive tour
3. Use the controls to navigate through tour steps
4. View historical information and facts for each location

### Using Trekking Directions

1. Select a fort from the trail selector
2. Click the "Get Directions" button
3. The system will automatically calculate routes using Google Maps Directions API
4. Choose from available trekking routes (hiking, driving, biking)
5. View detailed route information including:
   - Real-time distance and duration
   - Estimated elevation gain
   - Calculated difficulty level
   - Safety warnings and tips
   - Turn-by-turn directions
   - Interactive map display

## Development

```bash
npm install
npm run dev
```

## Available Tours

- **Sinhagad Fort Trek**: Historical fort with Tanaji Malusare memorial
- **Rajgad Fort Trek**: "King of Forts" with panoramic views
- **Torna Fort Trek**: First fort captured by Shivaji Maharaj

Each tour includes:
- Historical information
- Quick facts
- Street View integration
- Auto-advance functionality
- Manual navigation controls

### Trekking Routes Available

The system dynamically calculates routes using Google Maps Directions API for:

- **Sinhagad Fort**: Hiking, driving, and biking routes
- **Rajgad Fort**: Hiking, driving, and biking routes  
- **Torna Fort**: Hiking, driving, and biking routes

Each route includes:
- Real-time distance and duration calculations
- Estimated elevation gain based on distance
- Calculated difficulty ratings
- Safety warnings and tips
- Turn-by-turn directions
- Interactive map visualization