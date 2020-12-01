const mongoose = require('mongoose')
const Schema = mongoose.Schema

let relationSchema = new Schema(
  {
    userId1: {
      type: String,
      required: true
    },
    userId2: {
      type: String,
      required: true
    },
    // Status will vary between the following:
    // 1. FRIEND_REQUEST_1_TO_2
    // 2. FRIEND_REQUEST_2_TO_1
    // 3. FRIENDS
    // 4. BLOCKED_1_TO_2
    // 5. BLOCKED_2_TO_1
    // 6. BLOCKED_BOTH
    status: {
      type: String,
      required: true
    },
    // Optional message sent as part of friend request
    message: {
      type: String
    }
  },
  {
    timestamps: true,
    collection: 'relations'
  }
)

module.exports = mongoose.model('Relation', relationSchema)
