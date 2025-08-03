import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import SecurityInfo from './components/SecurityInfo';
import { useGeolocation } from './hooks/useGeolocation';
import { Issue, Comment } from './types';
import { checkRateLimit } from './utils/security';
import './App.css';

function App() {
  const { location, error, loading } = useGeolocation();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [issuesLoaded, setIssuesLoaded] = useState(false);

  // Load issues from localStorage on component mount
  useEffect(() => {
    const savedIssues = localStorage.getItem('issues');
    if (savedIssues) {
      try {
        const parsedIssues = JSON.parse(savedIssues).map((issue: any) => ({
          ...issue,
          createdAt: new Date(issue.createdAt),
          comments: issue.comments.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          })),
        }));
        setIssues(parsedIssues);
      } catch (error) {
        // Error loading from localStorage, start with empty array
      }
    }
    setIssuesLoaded(true);
  }, []);

  // Save issues to localStorage whenever issues change (but only after initial load)
  useEffect(() => {
    if (issuesLoaded) {
      localStorage.setItem('issues', JSON.stringify(issues));
    }
  }, [issues, issuesLoaded]);

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
    try {
      // Rate limiting for comments
      checkRateLimit('commentsPerHour');

      // Basic content validation for comments
      if (commentData.text.trim().length < 5) {
        throw new Error('Comment must be at least 5 characters long.');
      }

      if (commentData.text.trim().length > 500) {
        throw new Error('Comment too long. Please keep it under 500 characters.');
      }

      if (commentData.author.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long.');
      }

      if (commentData.author.trim().length > 50) {
        throw new Error('Name too long. Please keep it under 50 characters.');
      }

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
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred while adding your comment.');
    }
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
      
      <SecurityInfo />
      
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
