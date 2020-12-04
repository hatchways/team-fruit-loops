const express = require('express')
const router = express.Router()

router.get('/', function (req, res, next) {
  // TODO: Figure out how to prevent these console warnings:

  // Some cookies are misusing the recommended “SameSite“ attribute
  // Cookie “token” has been rejected because it is already expired.
  res.clearCookie('token')
  res.send({ success: true })
})

module.exports = router
