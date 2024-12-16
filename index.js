/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let coches = [
  { marca: "Renault", modelo: "Clio" },
  { marca: "Nissan", modelo: "Skyline R34" },
];
let concesionarios = [
  { 
    nombre: "ConcesionarioPaco", 
    direccion: "Calle Panal", 
    listaCoches: [
      { modelo: "FRV", potencia: "200CV", precio: "30000" },
      { modelo: "T-Cross", potencia: "150CV", precio: "27000" }
    ]
  },
  { 
    nombre: "ConcesionarioJuan", 
    direccion: "Avenida Libertad", 
    listaCoches: [
      { modelo: "T-Roc", potencia: "220CV", precio: "33000" },
      { modelo: "Qasqai", potencia: "190CV", precio: "40000" }
    ]
  }
];

// Lista todos los coches
app.get("/coches", (request, response) => {
  response.json(coches);
});

// Añadir un nuevo coche
app.post("/coches", (request, response) => {
  coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/coches/:id", (request, response) => {
  const id = request.params.id;
  const result = coches[id];
  response.json({ result });
});

// Actualizar un solo coche
app.put("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches = coches.filter((item) => coches.indexOf(item) !== id);

  response.json({ message: "ok" });
});

// Lista todos los concesionarios
app.get("/concesionario", (request, response) => {
  response.json(concesionarios);
});

// Añadir un nuevo concesionario
app.post("/concesionario", (request, response) => {
  concesionarios.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo concesionario
app.get("/concesionario/:id", (request, response) => {
  const id = request.params.id;
  const result = concesionarios[id];
  response.json({ result });
});

// Actualizar un solo concesionario
app.put("/concesionario/:id", (request, response) => {
  const id = request.params.id;
  concesionarios[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/concesionario/:id", (request, response) => {
  const id = request.params.id;
  concesionarios = concesionarios.filter((item) => concesionarios.indexOf(item) !== id);

  response.json({ message: "ok" });
});
// Lista de los coches de un concesionario
app.get("/concesionario/:id/coches", (request, response) => {
  const id = parseInt(request.params.id);
  const concesionario = concesionarios[id];
  response.json(concesionario.listaCoches);
});

// Añadir un coche a un concesionario
app.post("/concesionario/:id/coches", (request, response) => {
  const id = request.params.id;
  const nuevoCoche = request.body;
  nuevoCoche.id = concesionarios[id].listaCoches.length;
  concesionarios[id].listaCoches.push(nuevoCoche);
  response.json({ message: "ok" });
});

// Obtener un coche de un concesionario
app.get("/concesionario/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  const coche = concesionarios[id].listaCoches[cocheId];
  response.json(coche);
});

// Actualizar un coche de un concesionario
app.put("/concesionario/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].listaCoches[cocheId] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/concesionario/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].listaCoches.splice(cocheId, 1);
  response.json({ message: "ok" });
});
