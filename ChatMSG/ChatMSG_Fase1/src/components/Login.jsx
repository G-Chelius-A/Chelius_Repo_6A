import { useState } from 'react';
import { MessageCircle, ArrowRight } from 'lucide-react';

export default function Login({ onJoin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username cannot be empty');
      return;
    }
    setError('');
    onJoin(username);
  };

  return (
    <div className="login-container">
      <div className="glass-card login-card">
        <div className="login-header">
          <div className="logo-container">
            <MessageCircle size={32} className="logo-icon" />
          </div>
          <h1>ChatMSG</h1>
          <p>Join the real-time conversation</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              autoFocus
              maxLength={20}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="btn-primary login-btn">
            <span>Join Chat</span>
            <ArrowRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
