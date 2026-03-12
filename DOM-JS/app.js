/* 
    Existen 5 maneras de acceder a los elementos de un documento.
    .getElementById();
    .getElementsByClassName();
    .getElementByTagName();
    .querySelector();
    .querySelectorAll();
*/

//Vinculando el elemento HTML con JS.
/* const obj_title = document.getElementById("titulo");
console.log(obj_title.parentElement); */

//Vinculando con el nombre de la clase
/*const contenedor = document.getElementsByClassName("contenedor");
console.log(contenedor[0].classList);
*/

//const items=document.getElementsByTagName("li");
//console.log(items[0].textContent);

/*
const titulo=document.querySelector(".items-color1"); //Cuando hay muchos, regresa el primero-
console.log(titulo);

const titulo2=document.querySelector(".items-color2"); //Cuando hay muchos, regresa el primero-
console.log(titulo2.classList);

const titulo3=document.querySelectorAll("ul li.items-color3"); //Cuando hay muchos, regresa el primero-
console.log(titulo3[0].classList);
*/

/*const ab = document.querySelectorAll("ul li:not(.items-color3)"); //Selecciona los elementos que no tengan la clase items-color3
console.log(ab); */

/* const titulo = document.querySelector("#titulo");
titulo.innerText="Hola mundo de JavaScript";
titulo.style.color="black";

const ul=document.getElementsByTagName("ul");
console.log(ul[0].textContent); //Este considera la identación del HTML.
console.log(ul[0].innerText); //Este sólo considera el texto de adentro.
console.log(ul[0].innerHTML); //Este considera el texto y las etiquetas HTML.

const ancla=document.getElementsByTagName("a");
console.log(ancla[0].getAttribute("href"));
ancla[0].setAttribute("href","https://github.com/miRepoDemoRemoto");

const container = document.getElementsByClassName("contenedor");
console.log(container);
console.log(container[0].classList.contains("contenedor")); //Regresa true o false dependiendo si la clase existe o no.
console.log(container[0].classList.contains("items-color1"));
console.log(container[0].classList.add("items-color1"));
console.log(container[0].classList);

container[0].classList.add("texto-marron");
container[0].classList.remove("texto-marron");

*/

const listaItems = document.getElementsByTagName("ul");
const item_nuevo = document.createElement("li");
item_nuevo.innerText="Elemento 5";
item_nuevo.classList.add("items-color1");
listaItems[0].append(item_nuevo);
item_nuevo.remove();