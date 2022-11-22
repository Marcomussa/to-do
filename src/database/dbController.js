const bcrypt = require("bcrypt")
const UUID = require("uuid")
const session = require('express-session')
const mongoose = require("mongoose")
const Schema = mongoose.Schema
let today = new Date()
let date = today.getDate()
let month = today.getMonth() + 1
let year = today.getFullYear()

//* SCHEMAS:
let reminderSchema = new Schema({
    _id: String,
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    hour: {
        type: String,
        required: true
    },
    enableMailReminder: {
        type: Boolean
    },
    createdBy: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    }
}, {
    collection: "reminders"
})
const reminderModel = mongoose.model("Reminder", reminderSchema)
const createReminder = new reminderModel()

let userSchema = new Schema({
    _id: String,
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    collection: "users"
})
const userModel = mongoose.model("User", userSchema)
const createUser = new userModel()

//* CONTROLLER:
let dbController = {
    tests: (req, res) => {
        Model.find({
            name: "pepe"
        }, (err, docs) => {
           res.send({
                docs: docs
           })
        })
        //res.send("Testing DB...")
    },
    postRegister: async (req, res) => {
        let { name, surname, email, password } = req.body
        let encryptedPassword = await bcrypt.hash(password, 10)

        createUser._id = UUID.v4()
        createUser.name = name
        createUser.surname = surname
        createUser.email = email
        createUser.password = encryptedPassword
        
        createUser.save()

        res.redirect("/login")
    },

    //todo: Solucionar error de crash cuando ingresas mail invalido
    postLogin: (req, res) => {
        userModel.find({
            email: req.body.email
        }, (err, docs) => {
            if(bcrypt.compareSync(req.body.password, docs[0].password)){
                req.session.userLogged = {
                    id: docs[0]._id,
                    name: docs[0].name 
                }

                if(req.body.recordarSesion == "on"){
                    res.cookie('LoggedUserCookie', {
                        name: docs[0].name,
                        email: docs[0].email
                    })
                }

                console.log("Logged In")
                
                res.redirect("/")
            } else { 
                res.status(404).send("Auth Error") 
            }
        })
    },
    logOut: (req, res) => {
        req.session.destroy();
        res.redirect("/")
    },
    newReminder: (req, res) => { 
        let {title, description, date, hour, enableMailReminder} = req.body

        if(enableMailReminder == "on"){
            createReminder.enableMailReminder = true
        } else {
            createReminder.enableMailReminder = false
        } 

        createReminder._id = UUID.v4() 
        createReminder.title = title
        createReminder.description = description
        createReminder.createdBy = req.session.userLogged.id 
        createReminder.date = date
        createReminder.hour = hour
        createReminder.isCompleted = false
        createReminder.isNew = true 

        createReminder.save()

        res.redirect("../interface")
    },
    interface: (req, res) => {
        reminderModel.find({
            createdBy: req.session.userLogged.id,
            isCompleted: false
        }, (err, docs) => {
            res.render("interface", {
                docs
            })
        })
    },
    deleteReminder: (req, res) => {
        reminderModel.deleteOne({
            _id: req.params.id
        }, (err) => {
            if(err){
                throw new err
            } else {
                console.log(`Deleted: ${req.params.id}`)
                res.redirect("../../interface")
            }
        })
    },
    editReminder: (req, res) => {
        reminderModel.find({
            _id: req.query.id 
        }, (err, docs) => {

            req.session.prevReminder = {
                docs
            }

            res.render("editReminder", {
                docs
            })
        })
    }, 
    postEditRegister: (req, res) => {
        let query = {
            _id: req.query.id
        }

        let newData = {
            title: req.body.title == "" ? req.session.prevReminder.docs[0].title : req.body.title,
            description: req.body.description == "" ? req.session.prevReminder.docs[0].description : req.body.description,
            date: req.body.date == "" ? req.session.prevReminder.docs[0].date : req.body.date,
            hour: req.body.hour == "" ? req.session.prevReminder.docs[0].hour : req.body.hour
        }

        reminderModel.findOneAndUpdate(query, newData, {upsert: false}, (err, docs) => {
            if(err){
                res.send("Error de Edicion de Reminder: " + req.query.id)
            } else {
                res.redirect("../interface")
            }
        })
    },
    completedReminder: (req, res) => {
        reminderModel.find({
            createdBy: req.session.userLogged.id,
            isCompleted: true
        }, (err, docs) => {
            res.render("completedReminder", {
                docs
            })
        })
    },
    postCompletedReminder: (req, res) => {
        let query = {
            _id: req.query.id
        }

        let newData = {
            isCompleted: true
        }

        reminderModel.findOneAndUpdate(query, newData, {upsert: false}, (err, docs) => {
            if(err){
                res.send("Error de Edicion de Reminder: " + req.query.id)
            } else {
                res.redirect("../interface")
            }
        })
    },
    allReminders: (req, res) => {
        reminderModel.find({
            createdBy: req.session.userLogged.id
        }, (err, docs) => {
            res.render("allReminders", {
                docs
            })
        })
    },
    todayReminders: (req, res) => {
        let arr = []

        reminderModel.find({
            createdBy: req.session.userLogged.id
        }, (err, docs) => {
            for(let i = 0; i < docs.length; i++){
                if(docs[i].date.slice(0,4) == year && docs[i].date.slice(5,7) == month && docs[i].date.slice(8,10) == date){
                    arr.push(docs[i])
                }
            }
            res.render("todayReminder", {
                docs: arr
            })
        })
    },
    allRemindersNewest: (req, res) => {

    }
}

module.exports = dbController 