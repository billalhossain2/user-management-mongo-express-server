const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

//middlewares
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 9000;

app.get("/", (req, res)=>{
    res.send(`User management server is listening on the port ${port}`)
})





const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@cluster0.0ak1okw.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("usersDB");
    const usersCollection = database.collection("users")

    app.post("/user", async(req, res)=>{
        const user = req.body;
        const result = await usersCollection.insertOne(user)
        res.send(result)
    })

    app.get("/users", async(req, res)=>{
        const users = await usersCollection.find({}).toArray()
        res.send(users)
    })

    app.delete("/user/:userId", async(req, res)=>{
        const {userId} = req.params;
        const result = await usersCollection.deleteOne({"_id":new ObjectId(userId)})
        res.send(result)
    })

    app.put("/user/:userId", async(req, res)=>{
        const {userId} = req.params;
        const updateUser = req.body;
        
        const filter = {"_id":new ObjectId(userId)}
        const options = {upsert:true}
        const updateDoc = {
            $set:updateUser
        }

        const result = await usersCollection.updateOne(filter, updateDoc, options)
        res.send(result)
    })
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

















app.listen(port, ()=>{
    console.log(`User management server is running on the port ${port}`)
})

