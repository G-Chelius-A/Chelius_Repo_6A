import React from 'react'
import '../styles/card.css'
import pollo from '../images/iguana.jpg'
import mapache from '../images/perro.jpg'
import tigre from '../images/tigre.jpg'


const imagenes = {
    pollo, mapache, tigre
};

function Card(props){ //Props de proprieties
    return(
        <div className='contenedor-card'>
            <img
                className='imagen-card'
                src={imagenes[props.imagen]}
                alt='Foto de ${props.name}'
            />
            <div className='contenedor-texto-card'>
                <p className='nombre-card'> 
                    <strong> {props.nombre} </strong> 
                </p>
                <p className='pais-card'>{props.pais}</p>
                <p className='contenido-card'>{props.contenido}</p>
            </div>
        </div>
    );
}

export default Card;