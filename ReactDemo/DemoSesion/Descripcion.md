# Manejo de sesiones

## Sesión

Es un mecanismo que mantiene el estado entre múltiples peticiones HTTP de un mismo usuario, debido a que HTTP es un protocolo sin estado. Por lo tanto, la sesión es un contexto temporal asociado a un usuario y permite:

 * Identificarlo.
 * Guardar información relevante.
 * Dar continuidad en la interacción.

## Cómo funciona

 Cliente --> login
 Servidor --> crea una sesión y le asigna un ID=abc123 y se lo envía al cliente.
 Cliente --> Guarda ese ID=abc123 (cookie, localStorage, sessionStorage, objeto JS, BaseDatos del navegador)
 Cliente --> nueva petición, debe enviar su ID.
 Servidor --> Busca el ID de la sesión y reconoce al usuario.

## Claves del funcionamiento

* La sesión se guarda en el servidor y contiene los datos del usuario.
* La cookie se guarda en el cliente y contiene el ID de la sesión.

## Almacenamiento en el cliente

* localStorage --> Accesible vía JS y es persistente.
* sessionStorage --> Útil para estados intermedios, se elimina al cerrar la pestaña.
* Variable en memoria de JS --> No es persistente.
* IndexDB --> Base de datos en el navegador.
* Cookie --> Configurable (le podemos dar tiempo de vida) y de mayor seguridad con httpOnly
