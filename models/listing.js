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
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
    type: {
      type: String,   //Don't do "{location: { type: String } }"
      enum: ["Point"],// "location.type" must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});

listingSchema.post("findOneAndDelete", async function (Listing) {
  if (Listing) {
    await review.deleteMany(
      {
        _id: { $in: Listing.reviews }
      });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
