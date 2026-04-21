import { useAuthCookie } from './useAuthCookie';

export default function AppCookies() {
    const { token, login, logout } = useAuthCookie();

    return(
        <>
            <h3>Auth con cookies</h3>
            {
                token ? (
                    <>
                      <p>Sesión Activa</p>
                      <button onClick={logout}>Logout</button>
                    </>
                ):(
                    <>
                        <button onClick={login}>Login</button>
                    </>
                )
            }
        </>
    );

};