const express = require('express');
const app = express();
const port = 3600;
//Hacer que use JSOn.
app.use(express.json());

//Le ponemos datos
let data=[
    {id:1, superHero:"Batman"},
    {id:2, superHero:"Superman"},
    {id:3, superHero:"Ironman"}
];

app.listen(port, ()=>{
    console.log("Servidor http://localhost:"+port);
});

//Si solo se deja hasta aquí el código, necesitamos un ROUTE para las peticiones HTTP.
//Existen peticiones HTTP: GET, POST, PUT, DELETE como un CRUD.

//¿Cómo hacemos para que el Backend pueda contestar
app.get("/", (req, res) => {
    return res.send("Hola desde mi repodemoremoto con Nodemon");
});

app.get("/datos",(req,res)=>{
    return res.json(data);
});

//Con esto ya se puede hacer una llamada a MongoDB, hacer la consulta, pasárselo a Node y luego al Frontend

app.get("/datos/"+data[1].superHero,(req,res)=>{
    return res.json(data[1]);
});

//Agregar datos al arreglo:
app.post("/add", (req, res)=>{
    let nuevoHeroe = {
        id:data.length+1,
        superHero:req.body.superHero
    };
    data.push(nuevoHeroe);
    return res.status(200).json(data);
});

//Ingresar a POSTMan.

//Descargar el agente desktop de Postman.

