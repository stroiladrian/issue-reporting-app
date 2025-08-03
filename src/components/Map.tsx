import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Issue, Comment } from '../types';
import IssueModal from './IssueModal';
import AddIssueModal from './AddIssueModal';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  userLocation: { latitude: number; longitude: number } | null;
  issues: Issue[];
  onAddIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'comments'>) => void;
  onAddComment: (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const MapEvents: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const Map: React.FC<MapProps> = ({ userLocation, issues, onAddIssue, onAddComment }) => {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Update selectedIssue when issues change (e.g., when a comment is added)
  React.useEffect(() => {
    if (selectedIssue) {
      const updatedIssue = issues.find(issue => issue.id === selectedIssue.id);
      if (updatedIssue) {
        setSelectedIssue(updatedIssue);
      }
    }
  }, [issues, selectedIssue]);

  const handleMapClick = (lat: number, lng: number) => {
    setClickedLocation({ lat, lng });
    setShowAddModal(true);
  };

  const handleAddIssue = (issueData: { title: string; description: string; imageFile: File }) => {
    if (clickedLocation) {
      const imageUrl = URL.createObjectURL(issueData.imageFile);
      onAddIssue({
        latitude: clickedLocation.lat,
        longitude: clickedLocation.lng,
        title: issueData.title,
        description: issueData.description,
        imageUrl,
      });
      setShowAddModal(false);
      setClickedLocation(null);
    }
  };

  // Issue marker icon - red color #800517
  const customIcon = new L.DivIcon({
    className: 'custom-pin',
    html: `<div style="
      width: 20px; 
      height: 20px; 
      background-color: #800517; 
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -15],
  });

  // User location icon - blue color to distinguish
  const userIcon = new L.DivIcon({
    className: 'user-pin',
    html: `<div style="
      width: 20px; 
      height: 20px; 
      background-color: #007bff; 
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -15],
  });

  if (!userLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer
        center={[userLocation.latitude, userLocation.longitude]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents onMapClick={handleMapClick} />

        {/* User location marker */}
        <Marker
          position={[userLocation.latitude, userLocation.longitude]}
          icon={userIcon}
        >
          <Popup>Your Location</Popup>
        </Marker>

        {/* Issue markers */}
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => setSelectedIssue(issue),
            }}
          >
            <Popup>
              <div>
                <h3>{issue.title}</h3>
                <p>{issue.description.substring(0, 100)}...</p>
                <button onClick={() => setSelectedIssue(issue)}>
                  View Details
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {selectedIssue && (
        <IssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
          onAddComment={onAddComment}
        />
      )}

      {showAddModal && clickedLocation && (
        <AddIssueModal
          onClose={() => {
            setShowAddModal(false);
            setClickedLocation(null);
          }}
          onSubmit={handleAddIssue}
        />
      )}
    </div>
  );
};

export default Map;
