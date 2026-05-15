const mongoose = require("mongoose");
const UsuarioSchema = new mongoose.Schema({
   nombre: {
    type: String,
    required: true
   },
   email: {
    type:String,
    required: true
   },
   genero: {
    type:String,
    required: true
   },
   plataformas: {
    type: [String]
   }
});


module.exports = mongoose.model("Usuario", UsuarioSchema);

/*Structuring

function email(){}
function suma(){}
module.exports = email;
module.exports = {email: email, sumar: sumar}  // {nombreAqui: nombreAllá}

*/