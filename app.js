if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require("path")
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
app.use(express.static(path.join(__dirname,"/public")));
app.engine('ejs', ejsMate);
app.use(methodOverride("_method"));
app.set("view engine" , "ejs" );
app.set("views", path.join(__dirname , "views/listing"));
app.listen(3000);
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStratagy = require("passport-local");
const User = require("./models/user.js");
const dbURL = process.env.ATLAS_DB_URL;




mongoose.connect(dbURL)
  .then(() => console.log(' db Connected!'));


const store = MongoStore.create({
    mongoUrl: dbURL,
    crypto: {
      secret: process.env.SECRET,
    },
    touchafter: 24*3600,

});

store.on("error", ()=>{
  console.log("error in mongo session store",err )
})

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,

  }

};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/demouser",async(req, res)=>{
  let fakeUser =  new User({
    email: "student@gmail.com",
    username: "delta-student",
  });

  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser)
})

app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


app.use("/", userRouter);

app.get("/upcomming",async(req, res)=>{
  res.render("upcomming.ejs")
})
app.use("/listing",listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);



app.all("*",(req, res, next)=>{
  next(new ExpressError(404, "page not found"))
})

// app.use((err, req, res, next)=>{
//   let { statusCode = 500, message = "Something went wrong !" } = err;
//   res.status(statusCode).render("error.ejs",{ message });
// });


app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
});



app.listen(8080,()=>{
  console.log("server is lisiting")
});

















// app.get('/testListing1',(req,res)=>{
//   let sampleListing= new Listing({
//     title: "Cozy Beachfront Cottage",
//       description:
//         "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//       image:  "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//       price: 1500,
//       location: "Malibu",
//       country: "United States",
//       reviews (
//         comment: "sfavbaasv",
//         rating: 3

//       )
//   }
//   );
//   sampleListing.save();
//   console.log("listing created");
//   res.send("Listing created")

// })



//listing Route
// app.post("/listing", validateListing, wrapAsync( async (req,res, next)=>{
//     if(!req.body.listing){
//       throw new ExpressError(400, "send valid data for listing");
//     }
  
//     let newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listing")
// })
// );














// app.get('/testlisting', function (req, res) {
//     let sampleListing = new Listing({
//         title : "My first webpage" ,
//         description : "loremipsum fbfdjsdk" ,
//         image : "www.image.com" ,
//         price  : 3244 ,
//         location : "goa" ,
//         country : " India"

//     });
//     sampleListing.save()
//     console.log("listing created");
//     res.send("Listing created")

// });



