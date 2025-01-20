// Importamos las bibliotecas necesarias.
// Concretamente el framework express y ciertas librerías de mongodb.
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const helmet = require("helmet");
// Inicializamos la aplicación
const app = express();

// URL de conexión
const uri = "mongodb+srv://frodrui1708:I0qmNaRcksL4Qh8h@cluster0.alcge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());
app.use(helmet());

// Indicamos el puerto en el que vamos a desplegar la aplicación
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8080;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let db;

// Arrancamos la aplicación
app.listen(port, async () => {
  await client.connect();
  db = await client.db("concesionarios");

  console.log(`Servidor desplegado en puerto: ${port}`);
});

// Lista todos los coches
app.get("/concesionarios", async (request, response) => {
  const concesionarios = await db.collection("concesionarios_collection").find({}).toArray();

  response.json(concesionarios);
});

// Añadir un nuevo coche
app.post("/concesionarios", async (request, response) => {
  await db.collection("concesionarios_collection").insertOne(request.body);

  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/concesionarios/:id", async (request, response) => {
  const id = new ObjectId(request.params.id);
  const concesionarios = await db.collection("concesionarios_collection").find({ _id: id }).toArray();

  response.json({ concesionarios });
});

// Actualizar un solo coche
app.put("/concesionarios/:id", async (request, response) => {
  const id = new ObjectId(request.params.id);
  await db.collection("concesionarios_collection").updateOne({ _id: id }, { $set: request.body });

  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/concesionarios/:id", async (request, response) => {
  const id = new ObjectId(request.params.id);
  await db.collection("concesionarios_collection").deleteOne({ _id: id });

  response.json({ message: "ok" });
});

    // Obtener todos los coches de un concesionario por ID
    app.get("/concesionarios/:id/coches", async (request, response) => {
      const id = request.params.id;
      const concesionario = await db.collection("concesionarios_collection").findOne({ _id: new ObjectId(id) });
      response.json(concesionario.coches);
    });
    
    // Añadir un nuevo coche a un concesionario por ID
    app.post("/concesionarios/:id/coches", async (request, response) => {
      const id = request.params.id;
      const coche = request.body;
      coche._id = new ObjectId(); // Genera un nuevo ObjectId para el coche
      const result = await db.collection("concesionarios_collection").updateOne(
        { _id: new ObjectId(id) },
        { $push: { coches: coche } }
      );
      response.json({ message: "Coche añadido", modifiedCount: result.modifiedCount});
    });

    // Obtener un coche por ID de un concesionario por ID
    app.get("/concesionarios/:id/coches/:cocheId", async (request, response) => {
      const id = request.params.id;
      const cocheId = request.params.cocheId;
      const concesionario = await db.collection("concesionarios_collection").findOne({ _id: new ObjectId(id) });
      const coche = concesionario.coches.find(c => c._id.toString() === cocheId);
      response.json(coche);
    });

    // Actualizar un coche por ID de un concesionario por ID
    app.put("/concesionarios/:id/coches/:cocheId", async (request, response) => {
      const id = request.params.id;
      const cocheId = request.params.cocheId;
      const coche = request.body;

      const concesionario = await db.collection("concesionarios_collection").findOne({ _id: new ObjectId(id) });
      const cocheIndex = concesionario.coches.findIndex(c => c._id.toString() === cocheId);
      
      coche._id = concesionario.coches[cocheIndex]._id;
      concesionario.coches[cocheIndex] = coche;
      
      const result = await db.collection("concesionarios_collection").updateOne(
          { _id: new ObjectId(id) },
          { $set: { coches: concesionario.coches } }
        );
        response.json({ message: "Coche actualizado", modifiedCount: result.modifiedCount });
     
    });

    // Borrar un coche por ID de un concesionario por ID
    app.delete("/concesionarios/:id/coches/:cocheId", async (request, response) => {
      const id = request.params.id;
      const cocheId = request.params.cocheId;
      const result = await db.collection("concesionarios_collection").updateOne(
        { _id: new ObjectId(id) },
        { $pull: { coches: { _id: new ObjectId(cocheId) } } }
      );
      response.json({ message: "Coche borrado", modifiedCount: result.modifiedCount });
    });