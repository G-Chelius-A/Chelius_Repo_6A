import { useEffect, useState } from 'react'

function UsaHookEffect() {

    const [hora, setHora] = useState(new Date());

    useEffect(
        () => {
            const timer = setInterval(
                () => {
                    setHora(new Date())
                }, 1000
            );
            return () => clearInterval(timer);
        },[]
    );
    // Ese arreglo es para detectar el cambio de un objeto. Cada vez que haya un cambio en una lídea, habrá un cambio en el useEffect.


    return (
        <>
           <h1>Hola Effect</h1>
           <h1>La hora es: {hora.toLocaleTimeString()}</h1>
        </>
    );
}

export default UsaHookEffect;