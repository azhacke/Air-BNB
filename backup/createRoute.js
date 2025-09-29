//Create Route
app.post("/listings", async (req, res) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
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