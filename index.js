const epress = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const Cors = require('cors');
const multer = require('multer');
const Port = 4000

const {isAdmin} = require('./middleware.js');
const jwt = require('jsonwebtoken');


const app = epress();
app.use(Cors());
app.use(bodyParser.json());


let users = [{"username":"geri","email":"kubs@gmail.com","password":"123456","id":"1","role":"admin"}]

const tripedata = [{"destination":"Eldoret >>> Nairobi","date":"2023-10-20","Depature-time":"12:00","price":"2000"}]


app.post('/register',(req,res)=>{
 const {username,email,password,address, role = "user"} = req.body;
   
let userExists = users.find((user)=>{ user.email === email});
  if(userExists){
     res.status(400).send("User already exists")
    }
const HashedPassword = bcrypt.hashSync(password, 2);

const newUser = {
        username,
        email,
        password: HashedPassword,
        address
    }
    users.push(newUser);
    
    res.status(201).send("User created successfully");
}
);

app.post('/login',(req,res)=>{
    const {email,password} = req.body;
let userExists = users.find((user)=>{user.email ===email});
if(!userExists){
    res.status(400).send("User not found.please register");
}
const passwordcompare = users.find((user)=>{user.password === password});
if(!passwordcompare){
    res.status(400).send("Incorrect password");
}
res.status(200).send("Login successful");
   
});


app.get('/users', (req, res) => {
    res.status(200).json(users);
  
});


app.post('/admin',(req,res)=>{
    res.status(200).send("Welcome to the admin page");
});

app.post('/tripe',isAdmin,(req,res)=>{
    const {destination,date,Depature_time,price} = req.body;
   
const newTrip = {
        destination,
        date,
        Depature_time,
        price
    }
    tripedata.push(newTrip);
    res.status(201).send("Trip created successfully");
}
);

app.get('/tripe',(req,res)=>{
    res.status(200).json(tripedata);
}
);
app.get('/tripe/:id',(req,res)=>{
   const {destination,date,Depature_time,price} = req.body;
    const {id} = req.params;
    const tripe = tripedata.find((tripe)=>{tripe.id === id});
    if(!tripe){
        res.status(404).send("Trip not found");
    }
    res.status(200).json(tripe);

});

app.delete('/tripe/:id',isAdmin,(req,res)=>{
    const {id} = req.params;
    const tripe = tripedata.find((tripe)=>{tripe.id === id});
    if(!tripe){
        res.status(404).send("Trip not found");
    }
    tripedata.splice(tripedata.indexOf(tripe),1);
    res.status(200).send("Trip canceled successfully");
});


app.listen(Port , () => {
    console.log(`Server is running on port ${Port}`);
}
);
