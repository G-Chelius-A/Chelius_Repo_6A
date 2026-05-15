//Esto lo hace desde el front-end; o sea, oculta los routes a menos de que el usuario esté autenticado o que tenga una sesión.
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Login';
import { useAuth } from './useAuth';
import ProtectedRoute from './ProtectedRoute';
import Dashboard from './Dashboard';

export default function AppProtectedRoute() {
    const {user, loading, checkAuth} = useAuth();

    const logout = async() => {
        await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include"
        })
        checkAuth();
    }

    return(
        <BrowserRouter>
            <Routes>
                {/** Pública: a las que tenemos acceso sin estar logueados **/}
                <Route 
                    path="/login" 
                    element={<Login onLogin={checkAuth}/>}
                />
                {/** Protegida: a las que tenemos acceso al estar logueado **/}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute user={user} loading={loading}>
                            <Dashboard user={user} onLogout={logout}/>
                        </ProtectedRoute>
                    }
                />
                {/** Default: si no está declarado en lo público, te lleva aquí **/}
                <Route
                    path='*'
                    element={<Login onLogin={checkAuth}/>}
                />
            </Routes>
        </BrowserRouter>   
    );
}