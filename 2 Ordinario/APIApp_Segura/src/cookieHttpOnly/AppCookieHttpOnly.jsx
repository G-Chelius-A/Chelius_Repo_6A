import { useState } from "react";

export default function AppCookieHttpOnly() {
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("12345");
    const [mensaje, setMensaje] = useState("");

    const login = async () => {
        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({username, password})
        });

        const data = await res.json();
        setMensaje(data.message);
    };

    const obtenerPerfil = async () => {
        const res = await fetch("http://localhost:3000/perfil", {
            //method: "GET",
            credentials: "include"
        });
        const data = await res.json();
        setMensaje(data.message);
    };

    const logout = async () => {
        const res = await fetch("http://localhost:3000/logout", {
            method: "POST",
            credentials: "include"
        });

        const data = await res.json();
        setMensaje(data.message);
    }

    return(
        <>
            <h2>Autenticación con Cookie segura</h2>
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button onClick={login}>Login</button>
            <button onClick={obtenerPerfil}>Obtener Perfil</button>
            <button onClick={logout}>Logout</button>
            
            <div>
                <strong>Respuesta:</strong> {mensaje}
            </div>
        </>
    );
};