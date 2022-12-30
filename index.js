const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const completedTasks = client.db("taskApp").collection("completed");

    // get all the added tasks
    app.get("/tasks", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = tasksCollection.find(query).sort([["_id", -1]]);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });

    // update task
    app.patch("/tasks/edit/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const task = req.body;
      const option = { upsert: true };
      const updatedTask = {
        $set: {
          details: task.details,
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedTask,
        option
      );
      res.send(result);
    });

    // delete task
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });

    // post my tasks
    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    // post completed tasks
    app.post("/completed", async (req, res) => {
      const completed = req.body;
      const result = await completedTasks.insertOne(completed);
      res.send(result);
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
