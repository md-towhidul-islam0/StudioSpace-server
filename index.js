import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors"
import 'dotenv/config'
const app=express();
const PORT=process.env.PORT || 5000
app.use(cors());
app.use(express.json());

const client=new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}
const connetedClient=await connectToMongoDB();
const dataBase=connetedClient.db("assignment08pro")
const allCollectios=dataBase.collection("allcollections")


app.get('/', async(req,res)=>{
    const data=await allCollectios.find().toArray();
    res.send(data);
})

app.get('/allstudio', async(req,res)=>{
  const data=await allCollectios.find().toArray();
  res.send(data);
})
app.get('/allstudio/:category', async(req,res)=>{
  const category=req.params.category;
  const query={category:category};
  const result=await allCollectios.find(query).toArray();
  res.send(result)
})
app.get('/allstudio/d/:id', async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result=await allCollectios.findOne(query);
  console.log(result)
  res.send(result)
})
app.get('/allstudioLimit', async(req,res)=>{
  const data=await allCollectios.find().limit(6).toArray();
  res.send(data);
})

app.post('/add-studio', async(req,res)=>{
    const data=await allCollectios.find().toArray();
  const result=await allCollectios.insertOne(req.body);
  console.log(req.body);
  res.send(result);
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});