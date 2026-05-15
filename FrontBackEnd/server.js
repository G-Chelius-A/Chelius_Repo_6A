const express = require("express");
const cors = require("cors");

const app=express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

let usuarios = [
    {
        id:1,
        nombre:"Homer Simpson",
        email:"homer@fox.com",
        genero:"Masculino",
        plataformas:["Netflix","Prime"]
    },
    {
        id:2,
        nombre:"Peter Parker",
        email:"spiderman@marvel.com",
        genero:"Masculino",
        plataformas:["HBO","Disney+"]
    }
];

let idActual = 3;

app.get("/api/usuarios",(req, res)=>{
    res.json(usuarios);
});

app.post("/api/usuarios", (req, res)=>{
    const nuevo = {
        id:idActual++,
        nombre:req.body.nombre,
        email:req.body.email,
        genero:req.body.genero,
        plataformas:req.body.plataformas
    }
    usuarios.push(nuevo);
    res.json(nuevo);
});

app.put("/api/usuarios/:id", (req, res)=>{
    const id=parseInt(req.params.id);
    const usuario = usuarios.find(u => u.id==id);
    if(!usuario){
        return res.status(404).json({mensaje:"No encontrado"});
    }
    usuario.nombre=req.body.nombre;
    usuario.email=req.body.email;
    usuario.genero=req.body.genero;
    usuario.plataformas=req.body.plataformas;

    res.json(usuario);
});

app.listen(port, ()=>{
    console.log("Listening at http://localhost:"+port);
});