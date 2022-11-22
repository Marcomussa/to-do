const express = require('express')
const router = express.Router()
const mainController = require("../controllers/mainController")
const dbController = require("../database/dbController")

//? Main:
router.get('/', mainController.index)

router.get("/login", mainController.login)

router.get("/register", mainController.register)

router.get("/interface/new", mainController.newReminder)

//* Database:
router.post("/login", dbController.postLogin)

router.post("/register", dbController.postRegister)

router.post("/interface/new", dbController.newReminder)

router.post("/interface/edit", dbController.postEditRegister)

router.post("/interface/completed", dbController.postCompletedReminder)

router.get("/user/logout", dbController.logOut)

router.get("/tests", dbController.tests)

router.get("/interface", dbController.interface)

router.get("/interface/delete/:id", dbController.deleteReminder)

router.get("/interface/edit", dbController.editReminder)

router.get("/interface/completed", dbController.completedReminder)

router.get("/interface/all", dbController.allReminders)

router.get("/interface/today", dbController.todayReminders)

router.get("interface/newest", dbController.allRemindersNewest)

module.exports = router 