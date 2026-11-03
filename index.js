import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors"
import 'dotenv/config'
const app = express();
const PORT = process.env.PORT || 5000
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const connetedClient = await connectToMongoDB();
const dataBase = connetedClient.db("assignment08pro")
const allCollectios = dataBase.collection("allcollections")
const allBooking = dataBase.collection("allBooking")


app.get('/', async (req, res) => {
  const data = await allCollectios.find().toArray();
  res.send(data);
})

app.get('/allstudio', async (req, res) => {
  const data = await allCollectios.find().toArray();
  res.send(data);
})
app.get('/allstudio/:category', async (req, res) => {
  const category = req.params.category;
  const query = { category: category };
  const result = await allCollectios.find(query).toArray();
  res.send(result)
})
app.get('/allstudio/d/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid listing id' });
  }
  const query = { _id: new ObjectId(id) };
  const result = await allCollectios.findOne(query);
  if (!result) {
    return res.status(404).send({ message: 'Listing not found' });
  }
  console.log(result)
  res.send(result)
})
app.get('/allstudio/e/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  const query = { userEmail: userEmail };
  const result = await allCollectios.find(query).toArray();
  res.send(result)
})
app.get('/allstudioLimit', async (req, res) => {
  const data = await allCollectios.find().limit(6).toArray();
  res.send(data);
})

app.post('/add-studio', async (req, res) => {
  const data = await allCollectios.find().toArray();
  const result = await allCollectios.insertOne(req.body);
  console.log(req.body);
  res.send(result);
})

app.delete('/allstudio/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid listing id' });
  }
  const query = { _id: new ObjectId(id) };
  try {
    const result = await allCollectios.deleteOne(query);
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'Listing not found' });
    }
    console.log(`Listing ${id} deleted`);
    res.send({ acknowledged: result.acknowledged, deletedCount: result.deletedCount });
  } catch (err) {
    console.error('Error deleting listing:', err);
    res.status(500).send({ message: 'Failed to delete listing' });
  }
})

app.patch('/allstudio/d/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid listing id' });
  }
  const { _id, ...updates } = req.body || {};
  try {
    const result = await allCollectios.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: 'Listing not found' });
    }
    console.log(`Listing ${id} updated`);
    res.send({ acknowledged: result.acknowledged, modifiedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error updating listing:', err);
    res.status(500).send({ message: 'Failed to update listing' });
  }
})

app.get('/booking', async (req, res) => {
  const data = await allBooking.find().toArray();
  res.send(data);
})
app.post('/booking', async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    if (!req.body) {
      return res.status(400).send({
        message: "Request body is missing"
      });
    }

    const result = await allBooking.insertOne(req.body);

    res.status(201).send(result);

  } catch (error) {
    console.log("Booking Error:", error);

    res.status(500).send({
      message: error.message
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});