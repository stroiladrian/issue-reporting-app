import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import { useGeolocation } from './hooks/useGeolocation';
import { Issue, Comment } from './types';
import './App.css';

function App() {
  const { location, error, loading } = useGeolocation();
  const [issues, setIssues] = useState<Issue[]>([]);

  // Load issues from localStorage on component mount
  useEffect(() => {
    const savedIssues = localStorage.getItem('issues');
    if (savedIssues) {
      const parsedIssues = JSON.parse(savedIssues).map((issue: any) => ({
        ...issue,
        createdAt: new Date(issue.createdAt),
        comments: issue.comments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
        })),
      }));
      setIssues(parsedIssues);
    }
  }, []);

  // Save issues to localStorage whenever issues change
  useEffect(() => {
    localStorage.setItem('issues', JSON.stringify(issues));
  }, [issues]);

  const handleAddIssue = (issueData: Omit<Issue, 'id' | 'createdAt' | 'comments'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: Date.now().toString(),
      createdAt: new Date(),
      comments: [],
    };
    setIssues(prev => [...prev, newIssue]);
  };

  const handleAddComment = (issueId: string, commentData: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { ...issue, comments: [...issue.comments, newComment] }
        : issue
    ));
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Getting your location...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Location Error</h2>
        <p>{error}</p>
        <p>Please enable location services and refresh the page.</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Community Issue Reporter</h1>
        <p>Click anywhere on the map to report an issue in your community</p>
      </header>
      
      <Map
        userLocation={location}
        issues={issues}
        onAddIssue={handleAddIssue}
        onAddComment={handleAddComment}
      />
    </div>
  );
}

export default App;
