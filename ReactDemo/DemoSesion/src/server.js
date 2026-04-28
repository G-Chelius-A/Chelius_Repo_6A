//Hay que hacer: npm install express cors cookie-parser jsonwebtoken
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import auth from './cookieHttpOnly/auth.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const SECRET = "supersupersecreto";

app.post('/login', (req, res) => {
    const { username, password } = req.body;

     // Fake validation
    if(username === "admin" && password === "12345"){
        console.log("Login exitoso");
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        res.cookie("token", token, { 
            httpOnly: true, 
            secure: false,
            sameSite: "strict",
            maxAge: 3600000
        }); //sameSite: "lax", "strict", "none"
        return res.json({
            message: "Login exitoso"
        })
        console.log();
    }
    console.log("Login fallido");
    return res.status(401).json({
        message: "Credenciales inválidas"
    })
});

app.get('/perfil', auth, (req, res) => {
    res.json({
        message: "Eres un usuario protegido",
        user: req.user?.username
    })
});

app.post('/logout', (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "Logout exitoso"
    })
});

app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
})