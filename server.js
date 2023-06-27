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

app.post("/api/personas", async (req, res) => {
    const person = req.body
    console.log(person)
    
    Person.create({
        name:person.name,
        spent:0,
        owe:0,
    
    }).then((createdPerson)=>{
        res.status(201).json(createdPerson)
    })
})

app.put("/api/personas/", async (req, res) => {
    const person = req.body;
    console.log(person);
  
    try {
      const updatedPerson = await Person
      .findByIdAndUpdate(person.id, {
        $inc: { 
            spent: parseInt(person.spent),
             owe: parseInt(person.owe) },
      });
  
      console.log("Finish update");
      console.log(updatedPerson);
      res.status(200).json(updatedPerson);
    } catch (error) {
      console.error("Error al actualizar los valores:", error);
      res.status(500).json({ error: "Error al actualizar los valores" });
    }
  });




app.listen(port, () => {
    console.log({process})
    console.log(`Server is running on port ${port}`);
    
})
