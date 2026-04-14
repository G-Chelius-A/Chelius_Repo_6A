import '../styles/UsaHook.css'
import { useState } from 'react' //Manejas estados.
import { useEffect } from 'react' //Manejas efectos secundarios al hacer búsqueda en internet o en una API. Como una promesa.

function UsaHook() {
    //const [nombre, setNombre] = useState("Batman");
    //const [flag, setFlag] = useState(true);
    //const [fragmento, setFragmento] = useState(true);
    //const [genero, setGenero] = useState("Femenino");
    const [contador, setContador] = useState(0);

    /*return fragmento ?
        <>
            <div className='container'>
                <h1>{nombre}</h1>
            </div>
            <button onClick={()=>{setNombre("Pedro"); console.log(nombre)}}>Click Me!</button>
            {flag && <p>El flag es true</p>}
            <p>{flag?"Afirmativo":"Negativo"}</p>
            
            {genero == "Femenino" ? <p>Juana</p> : <p>Juan</p>}
        </>
        :
        <>
            <h1>Soy Spiderman</h1>        
        </>
        */
    return (
        <>
            <h1>{contador}</h1>
            <button onClick={() => setContador(contador + 1)}>Incrementar</button>
            <button onClick={() => setContador(contador - 1)}>Decrementar</button>
        </>
    );
}

export default UsaHook;