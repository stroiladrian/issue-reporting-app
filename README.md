# Community Issue Reporter

A web application for reporting local community issues like garbage, broken trees, illegal parking, and other neighborhood problems.

## Features

- **Interactive Map**: Uses OpenStreetMap with Leaflet for a Google Maps-like experience
- **User Location**: Automatically centers the map on the user's current location with zoom level 16
- **Pin Dropping**: Click anywhere on the map to drop a pin and report an issue
- **Photo Upload**: Upload photos to document the issue
- **Issue Details**: Add title and description for each reported issue
- **Comments System**: Other users can view issues and add comments
- **Local Storage**: Issues are saved locally in the browser
- **Responsive Design**: Works on both desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone or download this repository
2. Navigate to the project directory:
   ```bash
   cd issue-reporting-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Allow Location Access**: The app will request permission to access your location
2. **View the Map**: The map will center on your current location
3. **Report an Issue**: Click anywhere on the map to drop a pin
4. **Fill Details**: Add a title, description, and upload a photo
5. **Submit**: Click "Report Issue" to save the report
6. **View Issues**: Click on existing pins to view details and comments
7. **Add Comments**: Leave comments on existing issues

## Technology Stack

- **React 18** with TypeScript
- **Leaflet** for interactive maps
- **React Leaflet** for React integration
- **OpenStreetMap** for map tiles
- **Local Storage** for data persistence
- **CSS3** with modern styling

## Project Structure

```
src/
├── components/
│   ├── Map.tsx              # Main map component
│   ├── IssueModal.tsx       # Modal for viewing issue details
│   └── AddIssueModal.tsx    # Modal for adding new issues
├── hooks/
│   └── useGeolocation.ts    # Custom hook for location services
├── types/
│   └── index.ts             # TypeScript type definitions
├── App.tsx                  # Main application component
├── App.css                  # Application styles
├── index.tsx                # Application entry point
└── index.css                # Global styles
```

## Features in Detail

### Map Interface
- Interactive map centered on user location
- Zoom level 16 for detailed street view
- Click to drop pins for issue reporting
- Visual markers for all reported issues

### Issue Reporting
- Simple form with title and description
- Photo upload with preview
- Automatic geolocation capture
- Timestamp for each report

### Social Features
- View all reported issues on the map
- Click pins to see details and photos
- Add comments to existing issues
- Real-time updates

### Data Persistence
- All data stored locally in browser
- No server required
- Data persists between sessions
- Export/import functionality (future enhancement)

## Future Enhancements

- Backend integration for cloud storage
- User authentication and profiles
- Issue status tracking (reported, in progress, resolved)
- Email notifications for issue updates
- Advanced filtering and search
- Offline support with service workers
- Push notifications for nearby issues

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open an issue in the repository.
