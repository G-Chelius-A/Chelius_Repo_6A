const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Usuario = require("./models/Usuario.js"); //Puede o no tener el .js
//const {Usuario, email} = require("./models/Usuario.js") //Desestructuración o Destructuring.

const app=express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

//MongoDB
mongoose.connect("mongodb+srv://201120009_db_user:pincheMongoDB@cluster0.43iaflv.mongodb.net/GrupoA?appName=Cluster0")
.then(() => {console.log("MongoDB Ready")})
.catch(err => console.log(err));
//Si da error de conexión o consulta, desactivar SRV connection string en Mongo Atlas.

app.post("/api/usuarios", async (req, res)=>{
    const nuevo = new Usuario({
        nombre: req.body.nombre,
        email: req.body.email,
        genero: req.body.genero,
        plataformas: req.body.plataformas
    });
    const guardado = await nuevo.save();
    res.json(guardado);
});

app.get("/api/usuarios", async (req, res)=>{
    const usuarios = await Usuario.find();
    res.json(usuarios);
});

app.put("/api/usuarios/:id", async (req, res)=>{
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
        req.params.id,
        {
            nombre: req.body.nombre,
            email: req.body.email,
            genero: req.body.genero,
            plataformas: req.body.plataformas
        },
        {new: true}
    );
    res.json(usuarioActualizado);
});

app.listen(port, ()=>{
    console.log("Listening at http://localhost:"+port);
});