  // Importamos las bibliotecas necesarias.
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");


    // Inicializamos la aplicación
const app = express();

    // URL de conexión
const uri = "mongodb+srv://frodrui1708:I0qmNaRcksL4Qh8h@cluster0.alcge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

    // Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());
app.use(helmet());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

    // Añadir un nuevo concesionario
app.post("/concesionarios", async (request, response) => {
  await db.collection("concesionarios_collection").insertOne(request.body);

  response.json({ message: "ok" });
});

    // Obtener un solo concesionario
app.get("/concesionarios/:id", async (request, response) => {
  const id = new ObjectId(request.params.id);
  const concesionarios = await db.collection("concesionarios_collection").find({ _id: id }).toArray();

  response.json({ concesionarios });
});

    // Actualizar un solo concesionario
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
  await db.collection("concesionarios_collection").updateOne(
      { _id: new ObjectId(id) },
      { $push: { coches: coche } }
    );
  response.json({ message: "Coche añadido" });
});

    // Obtener un coche por indice en el array
app.get("/concesionarios/:id/coches/:index", async (request, response) => {
  const id = request.params.id;
  const index = parseInt(request.params.index, 10);
  const concesionario = await db.collection("concesionarios_collection").findOne({ _id: new ObjectId(id) });
    response.json(concesionario.coches[index]);
  });

    // Actualizar un coche por índice en el array
app.put("/concesionarios/:id/coches/:index", async (request, response) => {
  const id = request.params.id;
  const index = parseInt(request.params.index, 10);
  const coche = request.body;

  const concesionario = await db.collection("concesionarios_collection").findOne({ _id: new ObjectId(id) });
  concesionario.coches[index] = coche;

  await db.collection("concesionarios_collection").updateOne(
    { _id: new ObjectId(id) },
    { $set: { coches: concesionario.coches } }
  );

  response.json({ message: "Coche actualizado" });
});

    // Borrar un coche por índice en el array
app.delete("/concesionarios/:id/coches/:index", async (request, response) => {
  const id = request.params.id;
  const index = parseInt(request.params.index, 10);

  if (!ObjectId.isValid(id)) {
    return response.status(400).json({ message: "ID inválido" });
  }

  const concesionario = await db.collection("concesionarios_collection").findOne({ _id: new ObjectId(id) });
  concesionario.coches.splice(index, 1);

  await db.collection("concesionarios_collection").updateOne(
    { _id: new ObjectId(id) },
    { $set: { coches: concesionario.coches } }
  );

  response.json({ message: "Coche borrado" });
});
