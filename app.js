const express = require("express");
const app = express(); let port = 5001;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");//module


const MONGO_URL = "mongodb://localhost:27017/wanderlust";


//Database Connection
main()
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));
async function main(params) {
    await mongoose.connect(MONGO_URL);
}

//Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));//this is to use files in public folder


//Home Route
app.get("/", (req, res) => {
    res.redirect("/listings");
});


//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});


//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});


//show Route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

//Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
});

//Update Route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true, new: true });
    res.redirect(`/listings/${listing._id}`);
});

//Delete Route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});


//Delete route
// app.delete("/listings/:id", async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// });


//this is for handling all other routes which are not defined
// default route
// app.get("*", (req, res) => {
//     res.render("listings/default.ejs");
// });

//Test Listening
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "Sample Listing",
//         description: "This is near beach",
//         images: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEyMDd9",
//         price: 1200,
//         location: "Andhara Pradesh",
//         country: "INDIA"
//     });
//     await sampleListing.save().then(() => {
//         console.log("Sample listing Saved");
//         res.send("Test endpoint");
//     }).catch(err => console.log("This is error", err));
// });



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

