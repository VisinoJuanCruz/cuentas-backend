const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT ;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cors = require('cors');

const MONGODB_URL= `mongodb+srv://${process.env.USERDATABASE}:${process.env.PASSWORDDATABASE}@cluster0.ft1s0cc.mongodb.net/cuentas`

mongoose.connect(MONGODB_URL).then(()=>{
    console.log('Connected to MongoDB');

})


const personSchema = new Schema({
    name: String,
    spent: Number,
    owe: Number,
})

const Person = mongoose.model('Person', personSchema, "Persons");

const moveSchema = new Schema({
    name: String,
    spent: Number,
    owe: Number,
    motive: String,
}
)

const Move = mongoose.model('Move', moveSchema, "Move");



//Middlewares
app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(express.urlencoded({ extended: true }));


//ROUTES
app.get("/api/personas", async (req, res) => {
    Person.find().then((persons)=>{
        res.status(200).json(persons)
    }
    )
})

app.get("/api/moves", async (req, res) => {
    Move.find().then((moves)=>{
        res.status(200).json(moves)
    })
})

app.post("/api/moves", async (req, res) => {
    const person = req.body
    
    Move.create({
        name:person.name,
        spent:person.spent,
        owe:person.owe,
    
    }).then((createdMove)=>{
        res.status(201).json(createdMove)
    })
})




app.post("/api/personas", async (req, res) => {
    const person = req.body
    console.log(person.name)
    
    Person.create({
        name:person.name,
        spent:0,
        owe:0,
    
    }).then((createdPerson)=>{
        res.status(201).json(createdPerson)
    })
})

app.post("/api/personas", async (req, res) => {
    const person = req.body
    console.log(person,"NUEVO MOVIMIENTO")
    
    Move.create({
        name:person.name,
        spent:0,
        owe:0,
    
    }).then((createdPerson)=>{
        res.status(201).json(createdPerson)
    })
})

app.put("/api/personas/", async (req, res) => {
    const person = req.body;
  
    Move.create({
        name:person.name,
        spent:person.spent,
        owe:person.owe,
        motive:person.motive

    }).then((createdMove)=>{
        res.status(201).json(createdMove)
    })

    try {
      const updatedPerson = await Person
      .findByIdAndUpdate(person.id, {
        $inc: { 
            spent: parseInt(person.spent),
             owe: parseInt(person.owe) },
      });
  
      console.log("Finish update");
      res.status(200).json(updatedPerson);
    } catch (error) {
      console.error("Error al actualizar los valores:", error);
      res.status(500).json({ error: "Error al actualizar los valores" });
    }
  });




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    
})
