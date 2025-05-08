const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const Cors = require('cors');
const multer = require('multer');
const Port = 4000

const {isAdmin} = require('./middleware.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(Cors());
app.use(bodyParser.json());


let users = [{"username":"geri","email":"kubs@gmail.com","password":"123456","id":"1","role":"admin"}]

let tripedata = [{ "id":"1","destination":"Eldoret >>> Nairobi","date":"2023-10-20","Depature_time":"12:00","price":"2000"}]

let bookingsData = [{"id":"1","userId":"1","tripId":"1"}]

app.post('/register',(req,res)=>{
 const {username,email,password,address,id, role = "user"} = req.body;
   
 let userExists = users.find((user) => user.email === email);
  if(userExists){
  return    res.status(400).send("User already exists")
    }
const HashedPassword = bcrypt.hashSync(password, 2);

const newUser = {
       id:(users.length + 1).toString(),
        username,
        email,
        password: HashedPassword,
        address
    }
    users.push(newUser);
    
    res.status(201).send("User created successfully");
}
);

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    
const userExists = users.find((user) => user.email === email);
    if (!userExists) {
        return res.status(404).json({ error: "User not found. Please register." });
    }

  
 const passwordCompare = bcrypt.compareSync(password, userExists.password);
    if (!passwordCompare) {
        return res.status(401).json({ error: "Incorrect password." });
    }

const token = jwt.sign(
        { id: userExists.id, email: userExists.email, role: userExists.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

 res.status(200).json({
        message: "Login successful",
        token,
    });
});

app.get('/tripe', (req, res) => {
    res.status(200).json(tripedata);
});

app.post('/admin',(req,res)=>{
    res.status(200).send("Welcome to the admin page");
});

app.get('/users',(req,res)=>{
    res.status(200).json(users);
});
app.post('/tripe',isAdmin,(req,res)=>{
    const {destination,date,Depature_time,id,price} = req.body;

   
const newTrip = {
        id:(tripedata.length + 1).toString(),
        destination,
        date,
        Depature_time,
        price
    }
    tripedata.push(newTrip);
    res.status(201).send("Trip created successfully");
});


app.get('/tripe/:id', (req, res) => {
    const { id } = req.params;
    const tripe = tripedata.find((tripe) => tripe.id === id);
    if (!tripe) {
        return res.status(404).send("Trip not found");
    }
    res.status(200).json(tripe);
});
app.delete('/tripe/:id',isAdmin, (req, res) => {
    const { id } = req.params;
    const tripe = tripedata.find((tripe) => tripe.id === id);
    if (!tripe) {
        return res.status(404).send("Trip not found");
    }
   
    tripedata = tripedata.filter((tripe) => tripe.id !== id);
    res.status(200).send("Trip deleted successfully");
});

app.post('/bookings', (req, res) => {
    const { userId, tripId ,seatNumber} = req.body;

const tripeExist = tripedata.find((tripe) => tripe.id === tripId);
    if (!tripeExist) {
        return res.status(404).send("Trip not found");
    }
const seatTaken = bookingsData.find((booking) =>booking.tripId === tripId && booking.seatNumber === seatNumber);
    if (seatTaken) {
        return res.status(400).send("Seat already taken");
    }
    const newBooking = {
        id: (bookingsData.length + 1).toString(), 
        userId,
        tripId,
        seatNumber
    };

    bookingsData.push(newBooking);
    res.status(201).send("Booking created successfully");
}
);

app.get('/bookings', (req, res) => {
    res.status(200).json(bookingsData);
}); 


app.get('/bookings/:id', (req, res) => {
    const { id } = req.params;
    const booking = bookingsData.find((booking) => booking.id === id);
    if (!booking) {
        return res.status(404).send("Booking not found");
    }
    res.status(200).json(booking);
});


app.delete('/bookings/:id', (req, res) => {
    const { id } = req.params;
    const booking = bookingsData.find((booking) => booking.id === id); 
    if (!booking) {
        return res.status(404).send("Booking not found");
    }
    bookingsData = bookingsData.filter((booking) => booking.id !== id);
    res.status(200).send("Booking deleted successfully");
});

app.listen(Port , () => {
    console.log(`Server is running on port ${Port}`);
}
);
