import React, { useState } from 'react';

const SecurityInfo: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="security-info">
      <button 
        className="security-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="App Security Information"
      >
        🛡️ Security Info
      </button>
      
      {isVisible && (
        <div className="security-panel">
          <div className="security-panel-header">
            <h3>🛡️ Your Safety & Security</h3>
            <button 
              className="close-btn"
              onClick={() => setIsVisible(false)}
            >
              ×
            </button>
          </div>
          
          <div className="security-features">
            <div className="feature">
              <span className="icon">⏱️</span>
              <div>
                <strong>Rate Limiting</strong>
                <p>Maximum 3 reports per hour, 10 per day to prevent spam</p>
              </div>
            </div>
            
            <div className="feature">
              <span className="icon">📍</span>
              <div>
                <strong>Location Verification</strong>
                <p>Reports must be within 1km of your location</p>
              </div>
            </div>
            
            <div className="feature">
              <span className="icon">🖼️</span>
              <div>
                <strong>Image Validation</strong>
                <p>Max 2MB, verified file types (JPEG, PNG, WebP)</p>
              </div>
            </div>
            
            <div className="feature">
              <span className="icon">🔍</span>
              <div>
                <strong>Content Filtering</strong>
                <p>Automatic spam detection and duplicate prevention</p>
              </div>
            </div>
            
            <div className="feature">
              <span className="icon">🔒</span>
              <div>
                <strong>No Login Required</strong>
                <p>Report issues anonymously while staying protected</p>
              </div>
            </div>
          </div>
          
          <div className="security-footer">
            <small>
              These measures help maintain a quality, spam-free community 
              while keeping the app easy to use for everyone.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityInfo;