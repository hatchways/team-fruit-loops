const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    // Profile Picture
    imageUrl: {
      type: String,
    },
    account: {
      privateGames: {
        type: Boolean,
        default: false,
      },
      paymentID: {
        type: String,
        unique: true
      },
      paymentSecret: {
        type: String,
      }
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
