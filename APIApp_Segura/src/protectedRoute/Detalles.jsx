import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Detalles({ user, onLogout }) {
    const { id } = useParams();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchExerciseDetails = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/exercises/id/${id}`, {
                    credentials: "include"
                });
                
                if (!res.ok) throw new Error('Error al cargar detalles del ejercicio');
                const text = await res.text();
                let json;
                try {
                    json = JSON.parse(text);
                } catch(e) {
                    json = { data: [] };
                }
                setExercise(json.data?.[0] || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchExerciseDetails();
    }, [id]);

    if (loading) return <div className="page-header" style={{marginTop: '5rem'}}><h2>Cargando detalles...</h2></div>;
    if (!id) return <div className="page-header" style={{marginTop: '5rem'}}><h2>No se ha seleccionado ningún ejercicio. Vaya a Home o Buscar para seleccionar uno.</h2></div>;
    if (error) return <div className="page-header" style={{marginTop: '5rem'}}><h2 style={{color: '#ef4444'}}>Error: {error}</h2></div>;
    if (!exercise) return <div className="page-header" style={{marginTop: '5rem'}}><h2>No se encontró el ejercicio</h2></div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div className="page-header">
                <h1>Detalles del Ejercicio</h1>
                <p>Bienvenido, <strong>{user?.username}</strong></p>
            </div>
            
            <nav className="nav-bar">
                <Link to="/home">Home</Link>
                <Link to="/filtrar">Buscar</Link>
            </nav>

            <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={exercise.gifUrl || exercise.images?.[0]} alt={exercise.name} className="exercise-img" style={{ maxWidth: '500px', objectFit: 'contain' }} />
                    <h2 style={{ fontSize: '2rem', textTransform: 'capitalize', marginTop: '1rem', textAlign: 'center' }}>{exercise.name}</h2>
                </div>
                
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="glass-card" style={{ padding: '1rem' }}>
                        <h3 style={{ color: 'var(--accent)' }}>Información</h3>
                        <p className="info-text"><strong>Parte:</strong> {exercise.bodyPart}</p>
                        <p className="info-text"><strong>Músculo:</strong> {exercise.target}</p>
                        <p className="info-text"><strong>Equipo:</strong> {exercise.equipment}</p>
                    </div>
                    <div className="glass-card" style={{ padding: '1rem' }}>
                        <h3 style={{ color: 'var(--accent)' }}>Secundarios</h3>
                        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 ? (
                            exercise.secondaryMuscles.map((m, i) => <span key={i} className="badge" style={{ marginRight: '5px' }}>{m}</span>)
                        ) : (
                            <p className="info-text">Ninguno</p>
                        )}
                    </div>
                </div>

                {exercise.instructions && exercise.instructions.length > 0 && (
                    <div style={{ marginTop: '2rem' }} className="glass-card">
                        <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Instrucciones:</h3>
                        <ol style={{ paddingLeft: '1.5rem', margin: 0, color: 'var(--text)' }}>
                            {exercise.instructions.map((instruction, index) => (
                                <li key={index} style={{ marginBottom: '0.8rem', lineHeight: '1.5' }}>{instruction}</li>
                            ))}
                        </ol>
                    </div>
                )}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button className="btn-primary btn-danger" onClick={onLogout}>Cerrar sesión</button>
            </div>
        </div>
    );
}