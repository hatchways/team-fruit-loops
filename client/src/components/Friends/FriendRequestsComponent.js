import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import {
  Typography,
  ListItem,
  ListItemAvatar,
  Avatar,
  List,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip
} from '@material-ui/core'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'

const useStyles = makeStyles(theme => ({
  noResults: {
    textAlign: 'center',
    color: 'gray'
  }
}))

const FriendRequestsComponent = ({
  accountValues,
  relations,
  relationsUsers,
  reloadRelations,
  handleIncomingFriendRequestCountChange
}) => {
  const classes = useStyles()

  const [incomingRequests, setIncomingRequests] = useState([])
  const [sentRequests, setSentRequests] = useState([])

  const handleAcceptRequest = relation => {
    axios
      .patch('/users/add', {
        userId1: accountValues.id,
        userId2: relation.id
      })
      .then(() => {
        reloadRelations()
      })
      .catch(() => {})
  }

  const handleRemoveRequest = relation => {
    const userId1 = accountValues.id
    const userId2 = relation.id

    // DELETE requests have to pass to data instead of regular payload
    axios
      .delete('/users/remove', {
        data: {
          userId1: userId1,
          userId2: userId2
        }
      })
      .then(() => {
        reloadRelations()
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (relations && relationsUsers) {
      // Set incoming requests array by combining two filtered portions of the relation array
      // (Logged in user is being sent the friend request from someone else,
      // which is Id1 for FRIEND_REQUEST_2_TO_1 or Id2 for FRIEND_REQUEST_1_TO_2)
      // and concatenating the name and imageUrl information through cross-referencing to users array
      setIncomingRequests([
        ...relations
          .filter(
            relation =>
              relation.userId1 === accountValues.id &&
              relation.status === 'FRIEND_REQUEST_2_TO_1'
          )
          .map(filteredRelation => {
            let relationUser = relationsUsers.find(
              user => user._id === filteredRelation.userId2
            )

            if (!relationUser || Object.keys(relationUser).length === 0)
              return {}

            return {
              id: filteredRelation.userId2,
              message: filteredRelation.message,
              name: relationUser.name,
              imageUrl: relationUser.imageUrl
            }
          }),
        ...relations
          .filter(
            relation =>
              relation.userId2 === accountValues.id &&
              relation.status === 'FRIEND_REQUEST_1_TO_2'
          )
          .map(filteredRelation => {
            let relationUser = relationsUsers.find(
              user => user._id === filteredRelation.userId1
            )

            if (!relationUser || Object.keys(relationUser).length === 0)
              return {}

            return {
              id: filteredRelation.userId1,
              message: filteredRelation.message,
              name: relationUser.name,
              imageUrl: relationUser.imageUrl,
              userId: accountValues.id
            }
          })
      ])

      // Same logic as incoming requests but reversed
      setSentRequests([
        ...relations
          .filter(
            relation =>
              relation.userId1 === accountValues.id &&
              relation.status === 'FRIEND_REQUEST_1_TO_2'
          )
          .map(filteredRelation => {
            let relationUser = relationsUsers.find(
              user => user._id === filteredRelation.userId2
            )

            if (!relationUser || Object.keys(relationUser).length === 0)
              return {}

            return {
              id: filteredRelation.userId2,
              message: filteredRelation.message,
              name: relationUser.name,
              imageUrl: relationUser.imageUrl
            }
          }),
        ...relations
          .filter(
            relation =>
              relation.userId2 === accountValues.id &&
              relation.status === 'FRIEND_REQUEST_2_TO_1'
          )
          .map(filteredRelation => {
            let relationUser = relationsUsers.find(
              user => user._id === filteredRelation.userId1
            )

            if (!relationUser || Object.keys(relationUser).length === 0)
              return {}

            return {
              id: filteredRelation.userId1,
              message: filteredRelation.message,
              name: relationUser.name,
              imageUrl: relationUser.imageUrl,
              userId: accountValues.id
            }
          })
      ])

      handleIncomingFriendRequestCountChange(incomingRequests.length)
    }
  }, [
    relations,
    relationsUsers,
    accountValues.id,
    handleIncomingFriendRequestCountChange,
    incomingRequests.length
  ])

  return (
    <>
      <Typography>Incoming Friend Requests</Typography>
      <List>
        {/* Ensure this portion does not render before all the data is in, to prevent duplicate key warning (all NaN) */}
        {Object.keys(incomingRequests).length > 0 &&
        Object.keys(incomingRequests[0]).length > 0 ? (
          incomingRequests.map(relation => (
            <ListItem key={relation.id}>
              <ListItemAvatar>
                <Avatar
                  src={relation.imageUrl}
                  alt={relation.name}
                  className={classes.avatar}
                >
                  {relation.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={relation.name}
                secondary={relation.message}
              />
              <ListItemSecondaryAction>
                <Tooltip title='Accept'>
                  <IconButton
                    edge='end'
                    aria-label='Accept Request'
                    onClick={() => {
                      handleAcceptRequest(relation)
                    }}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Decline'>
                  <IconButton
                    edge='end'
                    aria-label='Remove Request'
                    onClick={() => {
                      handleRemoveRequest(relation)
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <div className={classes.noResults}>
            <Typography>No requests</Typography>
          </div>
        )}
      </List>
      <Typography>Sent Friend Requests</Typography>
      <List>
        {/* Ensure this portion does not render before all the data is in, to prevent duplicate key warning (all NaN) */}
        {Object.keys(sentRequests).length > 0 &&
        Object.keys(sentRequests[0]).length > 0 ? (
          sentRequests.map(relation => (
            <ListItem key={relation.id}>
              <ListItemAvatar>
                <Avatar
                  src={relation.imageUrl}
                  alt={relation.name}
                  className={classes.avatar}
                >
                  {relation.name && relation.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={relation.name}
                secondary={relation.message}
              />
              <ListItemSecondaryAction>
                <Tooltip title='Cancel Friend Request'>
                  <IconButton
                    edge='end'
                    aria-label='Remove Request'
                    onClick={() => {
                      handleRemoveRequest(relation)
                    }}
                  >
                    <CancelIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <div className={classes.noResults}>
            <Typography>No requests</Typography>
          </div>
        )}
      </List>
    </>
  )
}

export default FriendRequestsComponent
