import mongoose from "mongoose";

const schema = new mongoose.Schema({
  matchID: {
    type: String,
    required: true,
  },
  creatorID: {
    type: String,
    required: true,
  },
})

const Match = mongoose.model("match", schema);

export default Match;
