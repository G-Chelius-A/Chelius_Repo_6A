// Esto es una función síncrona
/* const showMessage = () => {
    setTimeout( ()=>{
        console.log("Hello");
    }, 3000);
}

showMessage(); */

//Esto es una función asíncrona. La manera correcta de ejecutarla es con await.
//Esto ya nos sirve para consultar APIs.
/*
async function tarea(){
    return "asynchronous task";
}

//async / await
async function ejecuta(){
    const respuesta = await tarea();
    console.log(respuesta);
}

ejecuta();
*/

//Promesas -> Tres estados: pending, fulfilled y rejected.
/*const promesa = new Promise(
    (resolve,reject) => {
        const todobien= false;
        setTimeout( () => {  //Recibe función y tiempo)
            if(todobien){
                resolve("Todo está muy bien");
            } else {
                reject("Todo mal");
            }
        },5000)
    });

console.log(promesa);
promesa.then(
    (respuesta) => {console.log(respuesta)}
).catch(
    (error) => {console.log(error)}
);*/

//Concatenar dos promesas
/*
const promesaUno = new Promise(
    (resolve, reject) => { resolve("Promesa uno resuelta");}
);

const promesaDos = new Promise(
    (resolve, reject) => { resolve("Promesa dos resuelta");}
);

const promesaTres = new Promise(
    (resolve, reject) => { reject("Promesa tres fallida");}
);

promesaUno.then(
    (res) => {console.log(res);
        return promesaDos;
    }
).then(
    (res) => {console.log(res);
        return promesaTres;
    }
).catch(
    (e) => {console.log(e)}
)

//Otra forma de consumir estas 3

promesaUno.then(
    (respuesta) => {
        console.log(respuesta);
        promesaDos.then(
            (respuesta2) => {
                console.log(respuesta2);
                promesaTres.then(respuesta2);
                promesaTres.then(
                    (respuesta3)=>{console.log(respuesta3)}
                ).catch(
                    (error) => {console.log(error)}
                );
            }
        )
    }
);|
*/

//FETCH es una función nativa de JavaScript para consumir APIs. Lo que me regresa Fetch es una promesa, así que hay que saber tratarlas nada más.
/*
const contenedor = document.getElementById("pokemonContainer");

async function getPokemon(){
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
    const datos = await respuesta.json();


    console.log(datos.results[0].url);
    const detalles = await fetch(datos.results[0].url);
    const detalle_pokemon = await detalles.json();
    console.log(detalle_pokemon);
    const col = document.createElement("div");
    col.className="col-md-4 col-lg-3";
    col.innerHTML = `
    <div class="card h-100 shadow-lg bg-secondary text-white">
        <img src="${detalle_pokemon.sprites.other['official-artwork'].front_default}"
        class="card-img-top p-3"
        alt ="${detalle_pokemon.name}">
        <div class="card-body text-center">
            <h5 class="card-title text-capitalize">${detalle_pokemon.name}</h5>
            <p class="card-text">
                Tipo: ${detalle_pokemon.types.map(t => t.type.name).join(", ")}
            </p>
    </div>
    `;

    contenedor.appendChild(col);
}

getPokemon();
*/

const contenedor = document.getElementById("pokemonContainer");

async function getPokemon(){
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=12');
    const datos = await respuesta.json();
    datos.results.forEach(
        pokemon => {fetchDetalles(pokemon.url)}
    );
}

async function fetchDetalles(url){
    const detalles = await fetch(url);
    const pokemo = await detalles.json();
    createCard(pokemo);
}

function createCard(pokemon){
    const col = document.createElement("div");
    col.className="col-md-4 col-lg-3";
    col.innerHTML = `
    <div class="card h-100 shadow-lg bg-secondary text-white">
        <img src="${pokemon.sprites.other['official-artwork'].front_default}"
        class="card-img-top p-3"
        alt ="${pokemon.name}">
        <div class="card-body text-center">
            <h5 class="card-title text-capitalize">${pokemon.name}</h5>
            <p class="card-text">
                Tipo: ${pokemon.types.map(t => t.type.name).join(", ")}
            </p>
    </div>
    `;
    contenedor.appendChild(col);
}

getPokemon();