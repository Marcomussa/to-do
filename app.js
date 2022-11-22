require("dotenv").config()
const express = require("express")
const path = require("path")
const routes = require("./src/routes/routes.js")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const isLoggedMiddleware = require("./src/middlewares/userLogged")
const PORT = 4000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser())

mongoose.connect(process.env.MONGOOSE_URI, (err) => {
    if(err){
        throw err
    } else {
        console.log("Conectado a la DB")
    }
}) 

app.use(isLoggedMiddleware)

app.use(express.static('public'));

app.use(express.static('public/views'));

app.use(express.static('public/css'));

app.use(express.static('public/scripts'));

app.set('views', __dirname  + '/public/views');

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use("/", routes)

app.listen(PORT, () => console.log( `Server on Port: ${PORT}` ))