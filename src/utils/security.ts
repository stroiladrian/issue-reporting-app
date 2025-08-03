// Security utilities for issue reporting app

export interface RateLimits {
  issuesPerHour: number;
  issuesPerDay: number;
  commentsPerHour: number;
}

export const RATE_LIMITS: RateLimits = {
  issuesPerHour: 3,
  issuesPerDay: 10,
  commentsPerHour: 5
};

export const SPAM_KEYWORDS = [
  'viagra', 'casino', 'lottery', 'free money', 'click here', 'buy now',
  'limited time', 'act now', 'congratulations', 'winner', 'prize',
  'investment', 'cryptocurrency', 'bitcoin', 'make money fast'
];

/**
 * Check if user has exceeded rate limits
 */
export const checkRateLimit = (type: keyof RateLimits): boolean => {
  const now = Date.now();
  const hourKey = `${type}_${Math.floor(now / 3600000)}`; // hourly key
  const dayKey = `${type}_day_${Math.floor(now / 86400000)}`; // daily key
  
  const hourlyCount = parseInt(localStorage.getItem(hourKey) || '0');
  const dailyCount = parseInt(localStorage.getItem(dayKey) || '0');
  
  // Check hourly limit
  if (type === 'issuesPerHour' && hourlyCount >= RATE_LIMITS.issuesPerHour) {
    throw new Error(`Rate limit exceeded. You can only report ${RATE_LIMITS.issuesPerHour} issues per hour.`);
  }
  
  if (type === 'commentsPerHour' && hourlyCount >= RATE_LIMITS.commentsPerHour) {
    throw new Error(`Rate limit exceeded. You can only add ${RATE_LIMITS.commentsPerHour} comments per hour.`);
  }
  
  // Check daily limit for issues
  if (type === 'issuesPerDay' && dailyCount >= RATE_LIMITS.issuesPerDay) {
    throw new Error(`Daily limit exceeded. You can only report ${RATE_LIMITS.issuesPerDay} issues per day.`);
  }
  
  // Increment counters
  localStorage.setItem(hourKey, (hourlyCount + 1).toString());
  if (type.includes('issues')) {
    localStorage.setItem(dayKey, (dailyCount + 1).toString());
  }
  
  return true;
};

/**
 * Validate image file size and type
 */
export const validateImage = async (file: File): Promise<boolean> => {
  // Size limit (2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Image must be under 2MB. Please compress your image or choose a smaller one.');
  }
  
  // File type validation
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed.');
  }
  
  // Image dimension validation
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.width > 1920 || img.height > 1080) {
        reject(new Error('Image dimensions too large. Maximum size: 1920x1080 pixels.'));
      } else if (img.width < 100 || img.height < 100) {
        reject(new Error('Image too small. Minimum size: 100x100 pixels.'));
      } else {
        resolve(true);
      }
    };
    img.onerror = () => reject(new Error('Invalid image file.'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate issue content for spam and quality
 */
export const validateContent = (title: string, description: string): boolean => {
  // Minimum content requirements
  if (title.length < 10) {
    throw new Error('Title must be at least 10 characters long. Please be more descriptive.');
  }
  
  if (title.length > 100) {
    throw new Error('Title too long. Please keep it under 100 characters.');
  }
  
  if (description.length < 20) {
    throw new Error('Description must be at least 20 characters long. Please provide more details.');
  }
  
  if (description.length > 1000) {
    throw new Error('Description too long. Please keep it under 1000 characters.');
  }
  
  // Spam detection
  const content = (title + ' ' + description).toLowerCase();
  const spamFound = SPAM_KEYWORDS.find(keyword => content.includes(keyword));
  
  if (spamFound) {
    throw new Error('Content appears to contain spam. Please review your submission.');
  }
  
  // Check for excessive repetitive characters
  if (/(.)\1{10,}/.test(content)) {
    throw new Error('Content contains too many repetitive characters.');
  }
  
  // Check for excessive uppercase
  const uppercaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
  if (uppercaseRatio > 0.5 && content.length > 20) {
    throw new Error('Please avoid excessive use of capital letters.');
  }
  
  return true;
};

/**
 * Calculate distance between two coordinates in meters
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

/**
 * Validate that issue location is within reasonable distance from user
 */
export const validateLocation = (
  issueLatitude: number, 
  issueLongitude: number, 
  userLatitude: number, 
  userLongitude: number
): boolean => {
  const maxDistance = 1000; // 1km radius
  const distance = calculateDistance(issueLatitude, issueLongitude, userLatitude, userLongitude);
  
  if (distance > maxDistance) {
    throw new Error(`Issues can only be reported within ${maxDistance}m of your location. This helps ensure reports are authentic and local.`);
  }
  
  return true;
};

/**
 * Check for duplicate content
 */
export const checkForDuplicates = (title: string, description: string): boolean => {
  const issues = JSON.parse(localStorage.getItem('issues') || '[]');
  const recentIssues = issues.slice(-10); // Check last 10 issues
  
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  const duplicate = recentIssues.find((issue: any) => {
    const existingTitle = issue.title.toLowerCase();
    const existingDesc = issue.description.toLowerCase();
    
    // Check for exact title match or very similar description
    return existingTitle === titleLower || 
           (existingDesc.includes(descLower.substring(0, 50)) && descLower.length > 50);
  });
  
  if (duplicate) {
    throw new Error('A similar issue was recently reported. Please check existing reports before submitting.');
  }
  
  return true;
};

/**
 * Clean up old rate limit data (call periodically)
 */
export const cleanupRateLimitData = (): void => {
  const now = Date.now();
  const cutoffHour = Math.floor(now / 3600000) - 24; // 24 hours ago
  const cutoffDay = Math.floor(now / 86400000) - 7; // 7 days ago
  
  // Clean up old entries
  Object.keys(localStorage).forEach(key => {
    if (key.includes('_hour_') || key.includes('_day_')) {
      const timestamp = parseInt(key.split('_').pop() || '0');
      if (key.includes('_hour_') && timestamp < cutoffHour) {
        localStorage.removeItem(key);
      } else if (key.includes('_day_') && timestamp < cutoffDay) {
        localStorage.removeItem(key);
      }
    }
  });
};