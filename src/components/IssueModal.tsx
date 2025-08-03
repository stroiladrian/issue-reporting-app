import React, { useState } from 'react';
import { Issue, Comment } from '../types';

interface IssueModalProps {
  issue: Issue;
  onClose: () => void;
  onAddComment: (issueId: string, comment: Omit<Comment, 'id' | 'createdAt'>) => void;
}

const IssueModal: React.FC<IssueModalProps> = ({ issue, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && authorName.trim()) {
      onAddComment(issue.id, {
        issueId: issue.id,
        text: newComment.trim(),
        author: authorName.trim(),
      });
      setNewComment('');
      setAuthorName('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="issue-details">
          <h2>{issue.title}</h2>
          <img 
            src={issue.imageUrl} 
            alt={issue.title}
            className="issue-image"
          />
          <p className="issue-description">{issue.description}</p>
          <p className="issue-date">
            Reported on {issue.createdAt.toLocaleDateString()}
          </p>
        </div>

        <div className="comments-section">
          <h3>Comments ({issue.comments.length})</h3>
          <div className="comments-list">
            {issue.comments.map((comment) => (
              <div key={comment.id} className="comment">
                <div className="comment-header">
                  <strong>{comment.author}</strong>
                  <span>{comment.createdAt.toLocaleDateString()}</span>
                </div>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmitComment} className="comment-form">
            <input
              type="text"
              placeholder="Your name"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              required
            />
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">Add Comment</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueModal;
