const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gxta02q.mongodb.net/?retryWrites=true&w=majority`;


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


        const usersCollection = client.db('bistroDb').collection('users');
        const menuCollection = client.db('bistroDb').collection('menu');
        const reviewsCollection = client.db('bistroDb').collection('reviews');
        const cartCollection = client.db('bistroDb').collection('carts');



        // users apis
        app.get('/users',async(req,res)=>{
            const result=await usersCollection.find().toArray();
            res.send(result)
        })


        app.post('/users', async (req, res) => {
            const user=req.body;
            console.log(user);
            const query={email:user.email}
            const existingUser = await usersCollection.findOne(query);
            console.log(existingUser);
            if(existingUser){
                return res.send({message:'users already exists'})
            }
            const result= await usersCollection.insertOne(user);
            res.send(result);
        })


        app.get('/menu', async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })


        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result)
        })

        //Cart Collection api
        app.get('/carts', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([])
            }
            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })


        app.post('/carts', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await cartCollection.insertOne(item);
            res.send(result);
            console.log(result);
        })

        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const query = { _id: new ObjectId(id) }
            console.log(query);
            const result = await cartCollection.deleteOne(query);
            console.log(result);
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
    res.send('restaurants food server running')
})




app.listen(port, () => {
    console.log(`restaurants food server port is :${port}`);
})