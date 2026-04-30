import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home({ user, onLogout }) {
    const [bodyParts, setBodyParts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBodyParts = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/exercises', {
                    credentials: "include"
                });
                
                if (!res.ok) throw new Error('Error al cargar ejercicios');
                const text = await res.text();
                const json = text.startsWith('{') ? JSON.parse(text) : { data: [] };
                setBodyParts(json.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBodyParts();
    }, []);

    if (loading) return <div className="page-header" style={{marginTop: '5rem'}}><h2>Cargando ejercicios...</h2></div>;
    if (error) return <div className="page-header" style={{marginTop: '5rem'}}><h2 style={{color: '#ef4444'}}>Error: {error}</h2></div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div className="page-header">
                <h1>Categorías de Ejercicios</h1>
                <p>Bienvenido, <strong>{user?.username}</strong></p>
            </div>
            
            <nav className="nav-bar">
                <Link to="/home">Home</Link>
                <Link to="/filtrar">Buscar</Link>
            </nav>

            <div className="grid-container">
                {bodyParts.map((part, index) => (
                    <div key={index} className="glass-card" style={{ alignItems: 'center' }}>
                        <img src={part.imageUrl} alt={part.name} className="exercise-img" style={{ objectFit: 'contain', background: 'transparent' }} />
                        <h3 style={{ marginTop: '0.5rem', fontSize: '1.4rem' }}>{part.name}</h3>
                        <Link to="/filtrar" state={{ query: part.name }} className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Ver ejercicios</Link>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className="btn-primary btn-danger" onClick={onLogout}>Cerrar sesión</button>
            </div>
        </div>
    );
}