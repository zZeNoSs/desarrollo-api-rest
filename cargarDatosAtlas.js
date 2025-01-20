const { MongoClient } = require("mongodb");
const fs = require("fs");

// Configura tu conexión a MongoDB Atlas
const uri = "mongodb+srv://frodrui1708:I0qmNaRcksL4Qh8h@cluster0.alcge.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function importData() {
  try {
    // Conecta a la base de datos
    await client.connect();
    console.log("Conexión exitosa a MongoDB Atlas");

    // Lee el archivo JSON
    const data = JSON.parse(fs.readFileSync("bddMongo.json", "utf8"));

    // Selecciona la base de datos y la colección
    const database = client.db("concesionarios");
    const collection = database.collection("concesionarios_collection");

    // Inserta los datos en la colección
    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documentos insertados correctamente`);
  } catch (error) {
    console.error("Error al importar los datos:", error);
  } finally {
    // Cierra la conexión
    await client.close();
  }
}

importData();
