import { Link } from 'react-router-dom';

export default function Dashboard({user, onLogout}){
    return(
        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div className="page-header">
                <h1>Dashboard</h1>
                <p>Bienvenido, <strong>{user?.username}</strong></p>
            </div>
            
            <nav className="nav-bar">
                <Link to="/home">Home</Link>
                <Link to="/filtrar">Buscar</Link>
            </nav>

            <div className="glass-card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>¡Hola, {user?.username}!</h2>
                <p className="info-text" style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                    Estás en la aplicación de ejercicios con la nueva interfaz premium. Usa el menú superior para empezar a explorar.
                </p>
                <button className="btn-primary btn-danger" onClick={onLogout}>
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
}