if(!process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
// console.log(process.env.secret);

const express = require("express");
const app= express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter= require("./routes/listing.js");
const reviewsRouter =require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dbUrl= process.env.ATLASDB_URL;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("ERROR in MONGO SESSION STORE", err);
});

const sesssionOptions ={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly: true,
    },
};



app.use(session(sesssionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(dbUrl);
}

app.get("/" ,(req,res)=>{
    res.redirect("/listings");
})

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser= req.user;
    next();
})

// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "student",
//     });

//     let registeredUser = await User.register(fakeUser, "helloWorld");
//     res.send(registeredUser);
// })

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/", userRouter);


app.all(/.*/, (req,res,next)=>{
   next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next)=>{
    let {statusCode=500, message="something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
})


app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});