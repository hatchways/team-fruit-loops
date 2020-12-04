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
        payment: {
          date: Date,
          piID: {
            type: String,
            unique: true
          },
          piSecret: String,
        },
        enabled: {
          type: Boolean,
          default: false,
        },
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

module.exports = mongoose.model("User", userSchema);
