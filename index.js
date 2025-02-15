const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb')
require('dotenv').config()

const port = process.env.PORT || 3000
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9clsv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
       const db = client.db('foodShare')
       const foodCollection = db.collection('food')

      //  save a foodData in db
      app.post('/add-food',async(req, res) =>{
        const foodData = req.body;
        const result = await foodCollection.insertOne(foodData);
        console.log(result);
        res.send(result)
      })

      // get all food data from db
      app.get('/food', async (req, res) => {
        const result = await foodCollection.find().toArray()
        res.send(result)
      })

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello from fOOdShare Server....')
})

app.listen(port, () => console.log(`Server running on port ${port}`))
