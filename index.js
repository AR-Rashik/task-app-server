const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

// MongoDB connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j6uwcgb.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const tasksCollection = client.db("taskApp").collection("tasks");

    // get all the added tasks
    app.get("/tasks", async (req, res) => {
      const query = {};
      const cursor = tasksCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });
  } finally {
  }
}
run().catch((error) => console.error("Database connection error", error));

app.get("/", (req, res) => {
  res.send("Task App server is running");
});

app.listen(port, () => {
  console.log(`Task app server is running on port ${port}`);
});
