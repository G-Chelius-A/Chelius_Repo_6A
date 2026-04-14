import { useEffect, useState } from 'react'

function MuestraPokemon() {

    const [pokemon, setPokemon] = useState(null);

    useEffect(
        () => {
            fetch("https://pokeapi.co/api/v2/pokemon/pikachu")
            .then(res => res.json())
            .then(data => setPokemon(data));
        },[]
    );

    return pokemon ?
        <>  
            <img src={pokemon.sprites.front_default} width={300}></img>
            <h1>Yo soy... {pokemon.name}</h1>
        </>
        :
        <>
            <h1>Cargando datos...</h1>
        </>
}

export default MuestraPokemon;