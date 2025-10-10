import express from "express";
import session from "express-session";
import flash from "connect-flash";
import path from "path";
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



const sessionOptions = {
    secret: "mysupersecretstring",   // <‑‑ used to sign the session ID cookie
    resave: false,                  // don’t save session if unmodified
    saveUninitialized: true,        // create a session cookie for new visitors
    // cookie: {
    //     maxAge: 1000 * 60 * 15,       // cookie expires after 15 minutes
    //     httpOnly: true,               // not accessible via client‑side JS (helps XSS)
    //     secure: false                 // set true when using HTTPS
    // }
};

app.use(session(sessionOptions));
app.use(flash());//why?

// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`you sent a request ${req.session.count} times`)
// })



app.get("/register", (req, res) => {
    let { name = "unkonwn" } = req.query;
    req.session.name = name;
    req.flash("sucess", "user registered sucessfully ....");
    res.redirect("/hello");
})

app.get("/hello", (req, res) => {

    res.render("page.ejs", { name: req.session.name });
})

app.listen(3000, () => {
    console.log("server is lisening  to  3000");
});