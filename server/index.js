const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('dotenv').config();



app.use(cors());
app.use(express.json());
app.use(cookieParser());

const URI = process.env.ATLAS_URI;
mongoose.connect(URI,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser:true});


const connection = mongoose.connection;
connection.once('open', () => {
    console.log("Connection to MongoDB database has been successfully established.")
}).catch(err => console.error(err));



const userRouter = require('./routes/users');
app.use('/users', userRouter);

app.listen(5000, () =>{
    console.log("Server is running at port 5000")
});
