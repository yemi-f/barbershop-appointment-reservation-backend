const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
require('dotenv').config();
require("./auth/auth");


const uri = process.env.MONGODB_URI;
const port = process.env.PORT || 5000;
const reservationsRoute = require("./routes/reservations");
const usersRoute = require("./routes/users");


app.use(cors());
app.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());


//routes
app.get('/', (_, res) => {
    res.send("This is home");
})

app.use("/reservations", reservationsRoute);
app.use("/users", usersRoute);

mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },
    () => console.log("connected to db")
);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});