import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Filtrar({ user, onLogout }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [exercises, setExercises] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    
    const location = useLocation();

    const searchExercises = async (queryParam) => {
        const queryToSearch = typeof queryParam === 'string' ? queryParam : searchTerm;
        if (!queryToSearch.trim()) return;

        setLoading(true);
        setError(null);
        setHasSearched(true);

        try {
            const query = encodeURIComponent(queryToSearch.trim());
            const res = await fetch(`http://localhost:3000/api/exercises/search/${query}`, {
                credentials: "include"
            });
            
            if (!res.ok) throw new Error('Error al buscar ejercicios');
            const text = await res.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch(e) {
                json = { data: [] };
            }
            setExercises(json.data || []);
        } catch (err) {
            setError(err.message);
            setExercises([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.query) {
            setSearchTerm(location.state.query);
            searchExercises(location.state.query);
            // Evitar re-búsqueda si se navega sin cambiar de componente
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchExercises();
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div className="page-header">
                <h1>Buscar Ejercicios</h1>
                <p>Bienvenido, <strong>{user?.username}</strong></p>
            </div>
            
            <nav className="nav-bar">
                <Link to="/home">Home</Link>
                <Link to="/filtrar">Buscar</Link>
            </nav>

            <div className="glass-card" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        className="input-field"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Buscar por músculo o nombre (ej: chest, lunge, squat)"
                        style={{ maxWidth: '400px' }}
                    />
                    <button className="btn-primary" onClick={searchExercises} disabled={loading}>
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </div>
                {error && <p style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem' }}>Error: {error}</p>}
            </div>

            {loading ? (
                <p style={{ textAlign: 'center' }}>Buscando ejercicios...</p>
            ) : hasSearched && exercises.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No se encontraron ejercicios con ese criterio.</p>
            ) : (
                <div className="grid-container">
                    {exercises.map((exercise, index) => (
                        <div key={index} className="glass-card">
                            <img src={exercise.gifUrl || exercise.images?.[0]} alt={exercise.name} className="exercise-img" />
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem', textTransform: 'capitalize' }}>{exercise.name}</h3>
                            <div style={{ marginBottom: '1rem' }}>
                                <span className="badge">{exercise.target}</span>
                                <p className="info-text"><strong>Equipo:</strong> {exercise.equipment}</p>
                            </div>
                            <Link to={`/detalles/${exercise.id}`} className="btn-primary" style={{ marginTop: 'auto' }}>Ver detalles</Link>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className="btn-primary btn-danger" onClick={onLogout}>Cerrar sesión</button>
            </div>
        </div>
    );
}