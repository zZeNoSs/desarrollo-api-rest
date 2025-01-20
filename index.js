/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// Inicializamos la aplicación
const app = express();
const uri = "mongodb+srv://frodrui1708:I0qmNaRcksL4Qh8h@cluster0.alcge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let db;
/*
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/
// Arrancamos la aplicación
app.listen(port, async () => {
  await client.connect();
  db = await client.db("mi-proyecto");

  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
/*let coches = [
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
*/
// Lista todos los concesionarios
app.get("/concesionarios", async (request, response) => {
  const concesionarios = await db.collection("concesionarios_collection").find({}).toArray();
  response.json(concesionarios);
});

// Añadir un nuevo concesionario
app.post("/concesionarios", async (request, response) => {
  await db.collection("concesionarios").insertOne(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  const id = new ObjectId(request.params.id);
  const concesionarios = await db.collection("concesionarios").find({ _id: id }).toArray();
  response.json({ concesionarios });
});

// Actualizar un solo concesionario
app.put("/concesionarios/:id", async (request, response) => {
   const id = new ObjectId(request.params.id);
   await db.collection("coches").updateOne({ _id: id }, { $set: request.body });
 
   response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/concesionarios/:id", async (request, response) => {
  const id = new ObjectId(request.params.id);
  await db.collection("coches").deleteOne({ _id: id });

  response.json({ message: "ok" });
});
// Lista de los coches de un concesionario
app.get("/concesionarios/:id/coches", (request, response) => {
  const id = parseInt(request.params.id);
  const concesionario = concesionarios[id];
  response.json(concesionario.listaCoches);
});

// Añadir un coche a un concesionario
app.post("/concesionarios/:id/coches", (request, response) => {
  const id = request.params.id;
  const nuevoCoche = request.body;
  nuevoCoche.id = concesionarios[id].listaCoches.length;
  concesionarios[id].listaCoches.push(nuevoCoche);
  response.json({ message: "ok" });
});

// Obtener un coche de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  const coche = concesionarios[id].listaCoches[cocheId];
  response.json(coche);
});

// Actualizar un coche de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].listaCoches[cocheId] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/concesionarios/:id/coches/:cocheId", (request, response) => {
  const id = request.params.id;
  const cocheId = request.params.cocheId;
  concesionarios[id].listaCoches.splice(cocheId, 1);
  response.json({ message: "ok" });
});
