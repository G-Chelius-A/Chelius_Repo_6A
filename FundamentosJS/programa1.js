/*console.log("Hola mundo");
document.write("<h1>Hola mundo</h1>");
document.writeln("<h2>Texto desde JS</h2>");*/

document.writeln("<h1>Hola</h1>");

//var declara una variable, let una variable de ámbito local de bloque y const una constante.

/*var _nombre = "Gerardo";
console.log(_nombre);
document.writeln(_nombre);
console.log(typeof(_nombre));*/

/*
var n=539042532790423907n;
console.log(n);
console.log(typeof(n));

var n="20";
console.log(n);
console.log(typeof(n));

//Number, bigint, string, boolean, etc.

var obj={"data":"hola"};
console.log(obj);
console.log(typeof(obj));

var array=[1,2,3,4,5];
console.log(typeof(array));

//Casting de datos
num="250";
numero=Number(num);
console.log(numero);
console.log(typeof(numero));

sino=Boolean(numero); //Esto se basa en la cadena si está vacía o no.
console.log(sino);
console.log(typeof(sino));


//Coerción
x="20.5";
y=true;
z=x+y;
console.log(z);
console.log(typeof(z));

//Operadores relacionales
//>, <, >=, <=, ==, ===, !=, !== está el exactamente igual y exactamente diferente.
console.log(20=="20"); //Primero hace la coerción, luego compara.
console.log(20==="20"); //Inhibe la coerción.
console.log(20!=="20");

*/

// Operadores lógicos: && || !

/*const age=18;
const status = age >= 18 ? "Mayor" : "Menor"; //Operador ternario. Retorna, como un if-else.
console.log(status); */

let x=5;
console.log(++x);
console.log(x--); //Decremento después de usar el valor.
console.log(x);


//control de flujo


function nombreFuncion(){
    return 10;
}

console.log(nombreFuncion());


const f = (n) => {console.log("Hola arrow function",n*n)} //estas funciones flecha se utilizan mucho.
f(30);

const f2 = n => n*n;
console.log(f2(5));
