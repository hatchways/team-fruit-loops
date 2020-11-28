// This document handles user search and friends system

const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Relation = require('../models/Relation')

// Status will vary between the following:
// 1. FRIEND_REQUEST_1_TO_2
// 2. FRIEND_REQUEST_2_TO_1
// 3. FRIENDS
// 4. BLOCKED_1_TO_2
// 5. BLOCKED_2_TO_1
// 6. BLOCKED_BOTH

// In this system, userId1 should be a lesser value than userId2 before saving it to the
// relation database to ensure relations bewteen two users only require one record

// Get all users
router.get('/', function (req, res, next) {
  User.find({}, 'name email imageUrl')
    .then(users => {
      return res.status(200).json(users)
    })
    .catch(err => {
      return res.status(500).send(err)
    })
})

// Search for multiple users given multiple ids
router.get('/findManyByIds', function (req, res, next) {
  // GET requests have to pass to req.query instead of req.body
  // userIds is an array
  // Example axios call: axios.get('/users/findManyByIds', { params: { userIds: usersIdArray } })
  const { userIds } = req.query

  User.find({}, 'name email imageUrl')
    .where('_id')
    .in(userIds)
    .then(users => {
      return res.status(200).json(users)
    })
    .catch(err => {
      return res.status(400).send(err)
    })
})

// Search for a specific user (must match name or email exactly)
router.get('/find/:id', function (req, res, next) {
  User.find(
    {
      $or: [
        { name: new RegExp(`^${req.params.id}$`, 'i') },
        { email: new RegExp(`^${req.params.id}$`, 'i') }
      ]
    },
    'name email imageUrl'
  )
    .then(users => {
      return res.status(200).json(users)
    })
    .catch(err => {
      return res.sendStatus(400)
    })
})

// Search for a specific user by id
router.get('/findbyId/:id', function (req, res, next) {
  User.find({ _id: req.params.id }, 'name email imageUrl')
    .then(users => {
      return res.status(200).json(users)
    })
    .catch(err => {
      return res.sendStatus(400)
    })
})

// Get all relations
router.get('/relations', function (req, res, next) {
  Relation.find({})
    .then(relations => {
      return res.status(200).json(relations)
    })
    .catch(() => {
      return res
        .status(400)
        .send('An error has occured while looking for relations.')
    })
})

// Get all relations of a user
router.get('/relations/:id', function (req, res, next) {
  Relation.find({
    $or: [{ userId1: req.params.id }, { userId2: req.params.id }]
  })
    .then(relations => {
      return res.status(200).json(relations)
    })
    .catch(() => {
      return res
        .status(400)
        .send('An error has occured while looking for relations.')
    })
})

// Send a friend request to a user
router.post('/add', function (req, res, next) {
  // userId1: User that is sending the friend request
  // userId2: User that is receiving the friend request
  // message: (Optional) Message associated with friend request
  const { userId1, userId2, message } = req.body

  if (userId1 === userId2) {
    return res.status(406).send('You cannot add yourself as a friend.')
  }

  // Verify that both users exist in the database
  User.exists({ _id: userId1 })
    .then(bExists1 => {
      if (!bExists1)
        return res
          .status(404)
          .send('Requesting user does not exist the database.')

      User.exists({ _id: userId2 })
        .then(bExists2 => {
          if (!bExists2)
            return res
              .status(404)
              .send(
                'User receiving friend request does not exist in the database.'
              )

          // Now we want to check that the friendship does NOT exist
          Relation.exists({
            $and: [
              { userId1: userId1 < userId2 ? userId1 : userId2 },
              { userId2: userId1 < userId2 ? userId2 : userId1 }
            ]
          })
            .then(bExists => {
              if (bExists)
                return res
                  .status(406)
                  .send(
                    'User has already been friend requested, added, or blocked.'
                  )

              // Ensure lesser userId is saved as userId1
              const params =
                userId1 < userId2
                  ? {
                      userId1: userId1,
                      userId2: userId2,
                      status: 'FRIEND_REQUEST_1_TO_2',
                      message: message
                    }
                  : {
                      userId1: userId2,
                      userId2: userId1,
                      status: 'FRIEND_REQUEST_2_TO_1',
                      message: message
                    }

              const relation = new Relation(params)

              relation
                .save()
                .then(data => {
                  return res.status(201).json(data)
                })
                .catch(err => {
                  return res.status(500).send(err)
                })
            })
            .catch(err => {
              return res.status(500).send(err)
            })
        })
        .catch(err => {
          res.status(500).send(err)
        })
    })
    .catch(err => {
      return res.status(500).send(err)
    })
})

// Accept a friend request
router.patch('/add', function (req, res, next) {
  // userId1: User that is accepting the friend request
  // userId2: User that sent the friend request
  const { userId1, userId2 } = req.body

  const query =
    userId1 < userId2
      ? [
          { userId1: userId1 },
          { userId2: userId2 },
          { status: 'FRIEND_REQUEST_2_TO_1' }
        ]
      : [
          { userId1: userId2 },
          { userId2: userId1 },
          { status: 'FRIEND_REQUEST_1_TO_2' }
        ]

  Relation.findOne({
    $and: query
  })
    .then(relation => {
      if (!relation)
        return res.status(404).send('No pending friend reqeust for this user.')

      relation.status = 'FRIENDS'
      relation
        .save()
        .then(data => {
          return res.status(200).json(data)
        })
        .catch(err => {
          return res.status(500).send(err)
        })
    })
    .catch(err => {
      return res.status(500).send(err)
    })
})

// Remove a relation (friend, friend request, or blocked)
router.delete('/remove', function (req, res, next) {
  // userId1: User that is removing a relation
  // userId2: User that is being removed from relation
  const { userId1, userId2 } = req.body

  const query =
    userId1 < userId2
      ? [{ userId1: userId1 }, { userId2: userId2 }]
      : [{ userId1: userId2 }, { userId2: userId1 }]

  Relation.findOneAndDelete({
    $and: query
  })
    .then(data => {
      if (!data) return res.status(404).send('Relation to user not found.')
      return res.status(200).json(data)
    })
    .catch(err => {
      return res.status(500).send(err)
    })
})

router.patch('/blacklist', function (req, res, next) {
  // userId1: User that is blacklisting
  // userId2: User that is being blacklisted
  const { userId1, userId2 } = req.body

  // id1 should be lesser than id2 to preserve one relation for two users
  const id1 = userId1 < userId2 ? userId1 : userId2
  const id2 = userId1 < userId2 ? userId2 : userId1
  const status = userId1 < userId2 ? 'BLOCKED_1_TO_2' : 'BLOCKED_2_TO_1'

  if (id1 === id2) return res.status(409).send("You can't block yourself.")

  Relation.findOne({
    $and: [{ userId1: id1 }, { userId2: id2 }]
  })
    .then(relation => {
      // Create if relation does not exist
      if (!relation) {
        const newRelation = new Relation({
          userId1: id1,
          userId2: id2,
          status: status
        })

        newRelation
          .save()
          .then(data => {
            return res.status(201).json(data)
          })
          .catch(err => {
            return res.status(500).send(err)
          })
        // Otherwise, update status
      } else {
        // If the other user already blacklisted the primary user, set status to "BLOCKED_BOTH"
        if (
          (userId1 === id1 && relation.status === 'BLOCKED_2_TO_1') ||
          (userId1 === id2 && relation.status === 'BLOCKED_1_TO_2')
        )
          relation.status = 'BLOCKED_BOTH'
        else if (
          relation.status ===
          (userId1 === id1 ? 'BLOCKED_1_TO_2' : 'BLOCKED_2_TO_1')
        ) {
          return res.status(409).send('You have already blacklisted this user.')
        } else {
          relation.status = status
        }

        relation
          .save()
          .then(data => {
            return res.status(200).json(data)
          })
          .catch(err => {
            return res.status(500).send(err)
          })
      }
    })
    .catch(err => {
      return res.status(500).send(err)
    })
})

router.patch('/unblock', function (req, res, next) {
  // userId1: User that is remove block
  // userId2: User that is being unblocked
  const { userId1, userId2 } = req.body

  // id1 should be lesser than id2 to preserve one relation for two users
  const id1 = userId1 < userId2 ? userId1 : userId2
  const id2 = userId1 < userId2 ? userId2 : userId1

  Relation.findOne({
    $and: [{ userId1: id1 }, { userId2: id2 }]
  })
    .then(relation => {
      if (!relation) return res.status(404).send('Relation to user not found.')

      if (relation.status === 'BLOCKED_BOTH') {
        relation.status = userId1 === id1 ? 'BLOCKED_2_TO_1' : 'BLOCKED_1_TO_2'

        relation
          .save()
          .then(data => {
            return res.status(200).json(data)
          })
          .catch(err => {
            return res.status(500).send(err)
          })
      } else if (
        relation.status !==
        (userId1 === id1 ? 'BLOCKED_1_TO_2' : 'BLOCKED_2_TO_1')
      ) {
        return res.status(409).send('This user was not blacklisted.')
      } else {
        relation.status = 'RELATION DELETED'
        relation
          .save()
          .then(() => {
            Relation.findOneAndDelete({
              $and: [{ userId1: id1 }, { userId2: id2 }]
            })
              .then(data => {
                if (!data)
                  return res.status(404).send('Relation to user not found.')
                return res.status(200).json(data)
              })
              .catch(err => {
                return res.status(500).send(err)
              })
          })
          .catch(err => {
            return res.status(500).send(err)
          })
      }
    })
    .catch(err => {
      return res.status(500).send(err)
    })
})

module.exports = router
