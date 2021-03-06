var createError = require("http-errors")
var express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
var session = require("express-session")

// This should refer to the local React and gets installed via `npm install` in
// the example.
var reactViews = require('express-react-views');

// two routers are used
var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")

var app = express()

// Set up mongoose connection
var mongoose = require("mongoose")
// change <username> and <password>
var mongoose = require("mongoose")
// FIXME
const username = 'paste username';
// FIXME
const password = 'paste password'
const db_name = 'gradebook-v1'
//FIXME change the URL @cluster address!
var mongo_db_url = `mongodb+srv://${username}:${password}@cluster0.qdxhi.mongodb.net/${db_name}?retryWrites=true&w=majority`

var mongoDB = process.env.MONGODB_URI || mongo_db_url
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on("error", console.error.bind(console, "MongoDB connection error:"))

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "jsx")
app.engine('jsx', reactViews.createEngine());

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// handles server side sessions
app.use(session({ 
    secret: "fd83rndfp;353laf;343some scret!",
    name: 'SESSION_ID',
    resave: true,
    saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    console.error(err.stack)
    res.render("error", {title: "Error"})
})

module.exports = app
