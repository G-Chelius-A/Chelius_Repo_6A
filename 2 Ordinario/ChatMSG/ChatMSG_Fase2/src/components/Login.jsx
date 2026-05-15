import { useState } from 'react';
import { MessageCircle, ArrowRight, Server } from 'lucide-react';
import { SERVERS } from '../socket';

export default function Login({ onJoin }) {
  const [username,       setUsername]       = useState('');
  const [selectedServer, setSelectedServer] = useState(SERVERS[0]);
  const [error,          setError]          = useState('');
  const [loading,        setLoading]        = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      setError('Username cannot be empty.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${selectedServer.url}/login`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ username: username.trim() }),
        credentials: 'include', // send/receive HttpOnly cookie
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Try again.');
      } else {
        // data.server is the SERVER_ID string from the backend (e.g. "Server-3001")
        onJoin(data.username, selectedServer.url, selectedServer.label);
      }
    } catch {
      setError(`Cannot reach ${selectedServer.label}. Is it running?`);
    } finally {
      setLoading(false);
    }
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
          {/* Server selector */}
          <div className="server-selector">
            <label className="server-label">
              <Server size={14} />
              <span>Connect to</span>
            </label>
            <div className="server-pills">
              {SERVERS.map((srv) => (
                <button
                  key={srv.url}
                  type="button"
                  className={`server-pill ${selectedServer.url === srv.url ? 'active' : ''}`}
                  onClick={() => { setSelectedServer(srv); setError(''); }}
                >
                  {srv.label}
                  <span className="server-port">:{srv.url.split(':').pop()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Username input */}
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              autoFocus
              maxLength={20}
              disabled={loading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn-primary login-btn" disabled={loading}>
            <span>{loading ? 'Connecting…' : 'Join Chat'}</span>
            {!loading && <ArrowRight size={20} />}
          </button>
        </form>
      </div>
    </div>
  );
}
