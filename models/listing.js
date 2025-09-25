const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
    // default: "https://www.psdstack.com/wp-content/uploads/2019/08/copyright-free-images-750x420.jpg",
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,//why ObjectId? because we are referencing another document (Review) in the database
      ref: "Review"
    }
  ]
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
