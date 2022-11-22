let mainController = {
    index: (req, res) => {
        res.render("index")
    },
    login: (req, res) => {
        res.render("login")
    },
    register: (req, res) => {
        res.render("register")
    },
    newReminder: (req, res) => {
        res.render("newReminder")
    }
}

module.exports = mainController