const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const cors = require('cors');
require('dotenv').config()
const router = require('./routes/user-routes.js');
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))

app.use('/api', router)


mongoose.connect("mongodb://127.0.0.1:27017/mern-auth").then(() => {
    app.listen(5000, () => {
        console.log('Database is connected and server listening');
    })
}).catch((error) => {
    console.log(error)
})
