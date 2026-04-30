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

// Datos de ejemplo para cuando la API no funcione
const sampleBodyParts = [
    { name: "BACK", imageUrl: "https://cdn.exercisedb.dev/bodyparts/back.webp" },
    { name: "CALVES", imageUrl: "https://cdn.exercisedb.dev/bodyparts/calves.webp" },
    { name: "CHEST", imageUrl: "https://cdn.exercisedb.dev/bodyparts/chest.webp" },
    { name: "SHOULDERS", imageUrl: "https://cdn.exercisedb.dev/bodyparts/shoulders.webp" },
    { name: "THIGHS", imageUrl: "https://cdn.exercisedb.dev/bodyparts/thighs.webp" },
    { name: "WAIST", imageUrl: "https://cdn.exercisedb.dev/bodyparts/waist.webp" },
    { name: "BICEPS", imageUrl: "https://cdn.exercisedb.dev/bodyparts/biceps.webp" },
    { name: "TRICEPS", imageUrl: "https://cdn.exercisedb.dev/bodyparts/triceps.webp" },
    { name: "HAMSTRINGS", imageUrl: "https://cdn.exercisedb.dev/bodyparts/hamstrings.webp" },
    { name: "QUADRICEPS", imageUrl: "https://cdn.exercisedb.dev/bodyparts/quadriceps.webp" }
];

const RAPIDAPI_KEY = '7501383676mshda362330f9c16bep188234jsnedbf95e611ae';
const RAPIDAPI_HOST = 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com';

const fetchFromAPI = async (endpoint) => {
    const url = `https://${RAPIDAPI_HOST}${endpoint}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': RAPIDAPI_KEY,
            'x-rapidapi-host': RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        }
    };
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return await response.json();
};

const mapExercise = (ex) => {
    if (!ex) return null;
    return {
        id: ex.exerciseId,
        name: ex.name,
        gifUrl: ex.imageUrl,
        target: ex.targetMuscles?.[0] || 'N/A',
        equipment: ex.equipments?.[0] || 'N/A',
        bodyPart: ex.bodyParts?.[0] || 'N/A',
        secondaryMuscles: ex.secondaryMuscles || [],
        instructions: ex.instructions || []
    };
};

// Endpoint para obtener las partes del cuerpo
app.get('/api/exercises', (req, res) => {
    res.json({ success: true, data: sampleBodyParts });
});

// Función auxiliar para priorizar barbell y dumbbells
const sortExercises = (exercises) => {
    return exercises.sort((a, b) => {
        const isAPriority = a.equipment.toLowerCase().includes('barbell') || a.equipment.toLowerCase().includes('dumbbell');
        const isBPriority = b.equipment.toLowerCase().includes('barbell') || b.equipment.toLowerCase().includes('dumbbell');
        if (isAPriority && !isBPriority) return -1;
        if (!isAPriority && isBPriority) return 1;
        return 0;
    });
};

// Endpoint de búsqueda unificada (por nombre o bodyPart)
app.get('/api/exercises/search/:query', async (req, res) => {
    try {
        const query = req.params.query.toLowerCase();
        const validBodyParts = ["BACK", "CARDIO", "CHEST", "LOWER ARMS", "LOWER LEGS", "NECK", "SHOULDERS", "UPPER ARMS", "UPPER LEGS", "WAIST"];
        
        let json;
        if (validBodyParts.includes(query.toUpperCase())) {
            json = await fetchFromAPI(`/api/v1/exercises?bodyParts=${query.toUpperCase()}&limit=50`);
            let exercises = (json.data || []).map(mapExercise);
            exercises = sortExercises(exercises);
            return res.json({ success: true, data: exercises });
        } else {
            // Obtener lote amplio y filtrar en memoria por nombre
            json = await fetchFromAPI(`/api/v1/exercises?limit=300`);
            let filtered = [];
            if (json && json.data) {
                filtered = json.data.filter(ex => 
                    ex.name.toLowerCase().includes(query) || 
                    ex.targetMuscles?.some(t => t.toLowerCase().includes(query)) ||
                    ex.bodyParts?.some(b => b.toLowerCase().includes(query))
                );
            }
            let exercises = filtered.map(mapExercise);
            exercises = sortExercises(exercises);
            return res.json({ success: true, data: exercises });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error al realizar la búsqueda híbrida" });
    }
});

// Endpoint para buscar ejercicios por parte del cuerpo
app.get('/api/exercises/bodyPart/:bodyPart', async (req, res) => {
    try {
        const bodyPart = req.params.bodyPart.toUpperCase();
        const json = await fetchFromAPI(`/api/v1/exercises?bodyParts=${bodyPart}&limit=50`);
        let exercises = (json.data || []).map(mapExercise);
        exercises = sortExercises(exercises);
        res.json({ success: true, data: exercises });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error al obtener ejercicios de la API externa" });
    }
});

// Endpoint para obtener detalles de un ejercicio por ID
app.get('/api/exercises/id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const json = await fetchFromAPI(`/api/v1/exercises/${id}`);
        if (json && json.data) {
            res.json({ success: true, data: [mapExercise(json.data)] });
        } else {
            res.json({ success: false, message: "Ejercicio no encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error al obtener detalle del ejercicio" });
    }
});

// Endpoint legacy para detalles
app.get('/api/exercises/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const json = await fetchFromAPI(`/api/v1/exercises/${id}`);
        if (json && json.data) {
            res.json({ success: true, data: [mapExercise(json.data)] });
        } else {
            res.json({ success: false, message: "Ejercicio no encontrado" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error al obtener detalle del ejercicio" });
    }
});

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