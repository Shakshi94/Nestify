if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}
const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const app = express();
const port = 3000;

const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
const expressError = require("./utlis/expressError.js");

const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const listingRoute = require('./routes/listing.js');
const reviewRoute = require('./routes/review.js');
const userRouter = require("./routes/users.js");


const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('./models/user.js');
const Db_url = process.env.ATLAS_DB;


main()
    .then(() => {
        console.log("connected succesful to DB");
    })
    .catch((err) => console.log(err));

async function main() {
     mongoose.connect(Db_url);
};

const store = MongoStore.create({
    mongoUrl: Db_url,
    crypto: {
        secret: process.env.secret_Code,
    },
    touchAfter: 24 * 3600
})

const sessionoption = {
    store,
    secret: process.env.secret_Code,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};



store.on("error", () => {
    console.log("Error in MongoDb session!!", err);
});



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(session(sessionoption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
    res.locals.message = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/", userRouter);
app.use("/listing", listingRoute);
app.use("/listing/:id/reviews", reviewRoute);

app.all("*", (req, res, next) => {
    next(new expressError(404, "page not found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "something went wrong" } = err;
    res.status(statusCode).render("Error.ejs", { err });
});

app.listen(port, () => {
    console.log(`Server is listening at ${port} port no.`);
});