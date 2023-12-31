const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// midleware
app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u7o1gfd.mongodb.net/?retryWrites=true&w=majority`;

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


        const dataBase = client.db('ibos').collection('tasks')

        app.get('/task', async (req, res) => {
            const cursor = dataBase.find()
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/task', async (req, res) => {
            const task = req.body;
            console.log('task', task);
            const result = await dataBase.insertOne(task)
            res.send(result)
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            console.log('please delete from database', id)
            const query = { _id: new ObjectId(id) }
            const result = await dataBase.deleteOne(query);
            res.send(result);
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('ibos task for intern server running')
})

app.listen(port, (req, res) => {
    console.log(`ibos server is running on port ${port}`)
})