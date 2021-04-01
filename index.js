const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require ('cors');
const bodyParser = require ('body-parser');
require('dotenv').config()
const port = process.env.PORT || 5555;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zroly.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
  const productCollection = client.db("grocery").collection("products");
  const ordersCollection = client.db("grocery").collection("orders");
//  console.log('database connected successfully')
app.get('/products',(req,res) => {
  productCollection.find()
  .toArray((err, items) => {
    res.send(items)
     console.log('from database', items)
  })
})
app.post('/addProduct', (req,res) =>{
    const newProduct = req.body;
    console.log('adding new product', newProduct)
    productCollection.insertOne(newProduct)
    .then(result => {
        // console.log('inserted count' , result.insertedCount )
        res.send(result.insertedCount> 0)
    })
})
//   client.close();
app.post('/addOrder', (req,res) =>{
  const order = req.body;
  // console.log('adding new order', order)
  ordersCollection.insertOne(order)
  .then(result => {
      // console.log('inserted number' , result.insertedCount )
      res.send(result.insertedCount> 0)
  })
})
});


app.listen(process.env.PORT || port)
  