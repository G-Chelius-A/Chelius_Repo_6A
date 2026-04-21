import useAuthLocalStorage from './useAuthLocalStorage';

export default function AppLocalStorage() {
    const { token, login, logout } = useAuthLocalStorage();

    return(
        <>
            <h3>Auth con localStorage</h3>
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