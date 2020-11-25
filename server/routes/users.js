const express = require('express')
const router = express.Router()

const User = require('../models/User')

router.get('/', function (req, res, next) {
  User.find({})
    .then(users => {
      const parsedUsers = users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl
      }))

      return res.status(200).json(parsedUsers)
    })
    .catch(err => {
      res.status(500).json({
        errors: err
      })
    })
})

module.exports = router
