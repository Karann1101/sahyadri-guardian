# Street View Setup Guide

## Google Maps API Key Configuration

The Street View feature requires a Google Maps API key to function properly. Follow these steps to set it up:

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Street View Static API**
   - **Places API**

4. Go to **Credentials** in the left sidebar
5. Click **Create Credentials** → **API Key**
6. Copy your API key

### 2. Configure the API Key

1. Create a `.env.local` file in your project root directory
2. Add the following line to the file:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
3. Replace `your_actual_api_key_here` with your actual Google Maps API key

### 3. Restart the Development Server

After adding the API key, restart your development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 4. Test the Street View

1. Navigate to `/street-view` in your application
2. Select a location from the list
3. The Street View should now load properly

## Finding Locations with Street View Coverage

### Why Some Locations Don't Have Street View

Google Street View doesn't cover all locations worldwide. Here are the main reasons:

1. **Limited Coverage Areas**: Street View is primarily available in:
   - Major cities and urban areas
   - Popular tourist destinations
   - Main roads and highways
   - Landmarks and monuments

2. **Privacy Restrictions**: Some areas are excluded due to:
   - Private property
   - Military installations
   - Sensitive government buildings
   - Privacy concerns

3. **Technical Limitations**: Street View may not be available in:
   - Remote rural areas
   - Off-road locations
   - Areas with poor road access
   - Newly developed areas

### How to Find Locations with Street View

#### 1. Use the Built-in Location Finder

The application includes a "Find More" tab with pre-verified locations that are guaranteed to have Street View coverage:

- **Landmarks**: Famous monuments, buildings, and attractions
- **Urban Areas**: City centers, main streets, and popular districts
- **Nature**: Scenic viewpoints and accessible natural locations

#### 2. Test Custom Locations

When adding custom locations:

1. Click "Add" to create a new location
2. Enter the coordinates and details
3. Use the "Test Street View Availability" button to check if Street View is available
4. The system will show a green checkmark for available locations or a red X for unavailable ones

#### 3. Tips for Finding Street View Locations

- **Major Cities**: Most major cities have extensive Street View coverage
- **Tourist Destinations**: Popular tourist spots are more likely to be covered
- **Main Roads**: Major highways and main streets usually have Street View
- **Landmarks**: Famous monuments and buildings are typically covered
- **Urban Areas**: City centers and downtown areas have good coverage

#### 4. Alternative Methods

If a location doesn't have Street View:

1. **Try Nearby Locations**: Move the coordinates slightly to find nearby Street View coverage
2. **Use Google Maps**: Check the location on Google Maps to see if Street View is available
3. **Look for Landmarks**: Find nearby landmarks that might have Street View
4. **Check Major Roads**: Look for the nearest major road or intersection

### Pre-verified Locations

The application includes these guaranteed Street View locations:

**Global Landmarks:**
- Times Square, New York
- Eiffel Tower, Paris
- Big Ben, London
- Shibuya Crossing, Tokyo
- Sydney Opera House
- Las Vegas Strip
- Venice Grand Canal
- Mount Fuji View
- Niagara Falls

**Indian Locations:**
- Gateway of India, Mumbai
- Marine Drive, Mumbai
- Taj Mahal, Agra

## Troubleshooting

### Common Issues

1. **"Google Maps API key is not configured"**
   - Make sure you've created the `.env.local` file
   - Ensure the API key is correct
   - Restart the development server

2. **"No Street View available at this location"**
   - Not all locations have Street View coverage
   - Try selecting a different location from the list
   - Use the "Find More" tab to discover verified locations
   - Test custom locations before adding them

3. **"Error loading Street View"**
   - Check your internet connection
   - Verify that all required APIs are enabled in Google Cloud Console
   - Ensure your API key has the necessary permissions

4. **"Street View not working for known locations"**
   - Some locations may have temporary coverage issues
   - Try refreshing the page
   - Check if the location is still available on Google Maps
   - Use the test function to verify availability

### API Key Security

- Never commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- For production, set the environment variable in your hosting platform

### Cost Considerations

- Google Maps API has usage limits and costs
- Street View API calls are charged per request
- Monitor your usage in the Google Cloud Console
- Consider setting up billing alerts

## Best Practices

1. **Use Pre-verified Locations**: Start with the built-in locations that are guaranteed to work
2. **Test Before Adding**: Always test custom locations before adding them to your list
3. **Check Coverage**: Use Google Maps to verify Street View availability before adding coordinates
4. **Monitor Usage**: Keep track of your API usage to avoid unexpected costs
5. **Have Fallbacks**: Provide alternative viewing options for locations without Street View

## Support

If you're still having issues:

1. Check the browser console for error messages
2. Verify your API key is working with other Google Maps services
3. Test with known working locations first
4. Ensure all required APIs are enabled in Google Cloud Console
5. Check your internet connection and firewall settings 