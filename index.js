const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m0coh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("avenue_backend");
    const usersCollection = database.collection("users");

    // create users
    app.post("/api/add-user", async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // get all users
    app.get("/api/users", async (req, res) => {
      const query = {};

      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Avenue Backend is Running");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
