const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const Cors = require('cors');
const multer = require('multer');


const {isAdmin} = require('./middleware.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const PORT = process.env.PORT;
const app = express();
app.use(cors({
    origin: 'https://kubs-g.github.io' 
  }));
app.use(bodyParser.json());
app.use(express.json());

let users = [{"id":"1","username":"gerry","email":"kubs@gmail.com","password":bcrypt.hashSync("123456",2),"address":"Nairobi","role":"admin"}]

let tripedata = [{"id":"1","destination":"Eldoret >>> Nairobi","date":"2023-10-20","Depature_time":"12:00","price":"2000"},
                 {"id":"2","destination":"Eldoret >>> Mombasa","date":"2023-10-20","Depature_time":"11:00","price":"5000"},
                 {"id":"3","destination":"Eldoret >>> Naivasha","date":"2023-10-20","Depature_time":"10:00","price":"2500"}
]

let bookingsData = [{"id":"1","userId":"1","tripId":"1","username":"gerry","destination":"Eldoret >>> Nairobi","seatNumber":"1"}]

app.post('/register',(req,res)=>{
 const {username,email,password,address,role = "user"} = req.body;
  
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
        address,
        role
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
        { id: userExists.id,username:userExists.username, email: userExists.email, role: userExists.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

 res.status(200).json({
        message: "Login successful",
        token,
        username: userExists.username,
    });
});
app.get('/tripe', (req, res) => {
    const tripsWithSeats = tripedata.map((tripe) => {
        const bookedSeats = bookingsData
            .filter((booking) => booking.tripId === tripe.id)
            .map((booking) => booking.seatNumber);
        return {
            ...tripe,
            availableSeats: bookedSeats
        };
    });
    res.json(tripsWithSeats);
});

app.post('/admin',(req,res)=>{
    res.status(200).send("Welcome to the admin page");
});

app.get('/users',(req,res)=>{
    res.status(200).json(users);
});
app.post('/trip',isAdmin,(req,res)=>{
    const {destination,date,price} = req.body;

   
const newTrip = {
        id:(tripedata.length + 1).toString(),
        destination,
        date,
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
    const { username,destination,tripId,seatNumber} = req.body;

const tripeExist = tripedata.find((tripe) => tripe.id === tripId);
    if (!tripeExist) {
        return res.status(404).send("Trip not found");
    }

const Destination = tripedata.find((tripe) => tripe.destination === destination);
    if (!Destination) {
        return res.status(404).send("Destination not found");
    }

const seatTaken = bookingsData.find((booking) =>booking.tripId === tripId && booking.seatNumber === seatNumber);
    if (seatTaken) {
      return res.status(400).json("Seat already booked");
    }
const availableSeats = bookingsData.filter((booking) => booking.tripId === tripId).map((booking) => booking.seatNumber);
    if (availableSeats.length >= 6) {
        return res.status(400).json("No available seats left for this trip");
    }


    const newBooking = {
        id: (bookingsData.length + 1).toString(), 
        username,
        destination,
        seatNumber,
        tripId
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


app.get('/search', (req, res) => {
    const { destination } = req.query;
    const filteredTrips = tripedata.filter((trip) =>
        trip.destination.toLowerCase().includes(destination.toLowerCase())
    );
   if(filteredTrips.length === 0){
        return res.status(404).send("tripe not found");
    }
    
    res.status(200).json(filteredTrips);
});

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`);
}
);
