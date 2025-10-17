const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }//no need to add username and password fields as passport-local-mongoose will add them automatically
});

userSchema.plugin(passportLocalMongoose);//this will add username, hash and salt fields to store the username and the hashed password

module.exports = mongoose.model("User", userSchema);