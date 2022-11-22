//TODO: Implementar vars de entorno

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
const mongoose_USER = "SatoIsReal"
const mongoose_PASSWORD = "gMTfkHdpmXMjD5so"
const mongoose_URI =  `mongodb+srv://${mongoose_USER}:${mongoose_PASSWORD}@cluster0.6ines.mongodb.net/To-Do?retryWrites=true&w=majority`

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(session({
    secret: 'Sato',
    resave: true,
    saveUninitialized: true
}))

app.use(cookieParser())

mongoose.connect(mongoose_URI, (err) => {
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