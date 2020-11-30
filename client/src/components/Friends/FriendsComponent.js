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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
} from '@material-ui/core'

import CancelIcon from '@material-ui/icons/Cancel'

const useStyles = makeStyles(theme => ({
  noResults: {
    textAlign: 'center',
    color: 'gray'
  },
  avatar: {
    border: '1px solid black'
  },
  dialog: {
    padding: theme.spacing(1)
  }
}))

const FriendsComponent = ({
  accountValues,
  relations,
  relationsUsers,
  setSnackbarOpen,
  setSnackBarMessage,
  reloadRelations,
  handleFriendCountChange
}) => {
  const classes = useStyles()

  const [friends, setFriends] = useState([])

  // Set boolean variable for opening modal
  const [bModalOpen, setBModalOpen] = useState(false)
  // User that is being sent a friend request
  const [friendRemoveUser, setFriendRemoveUser] = useState({})

  const handleFriendRemoveModalOpen = user => {
    // Set friend request user to selected
    setFriendRemoveUser(user)
    setBModalOpen(true)
  }

  const handleFriendRemoveModalClose = () => {
    setBModalOpen(false)
    // Added a small delay so you do not see the values resetting as the modal is fading
    setTimeout(() => {
      setFriendRemoveUser({})
    }, 500)
  }

  const handleFriendRemoveSubmit = () => {
    // DELETE requests have to pass to data instead of regular payload
    axios
      .delete('/users/remove', {
        data: {
          userId1: accountValues.id,
          userId2: friendRemoveUser.id
        }
      })
      .then(() => {
        reloadRelations()
        handleFriendRemoveModalClose()
      })
      .catch(err => {
        setSnackbarOpen(true)
        setSnackBarMessage(err.response.data)
      })
  }

  useEffect(() => {
    if (relations && relationsUsers) {
      setFriends([
        ...relations
          .filter(
            relation =>
              relation.userId1 === accountValues.id &&
              relation.status === 'FRIENDS'
          )
          .map(filteredRelation => {
            let relationUser = relationsUsers.find(
              user => user._id === filteredRelation.userId2
            )

            if (!relationUser || Object.keys(relationUser).length === 0)
              return {}

            return {
              id: filteredRelation.userId2,
              name: relationUser.name,
              email: relationUser.email,
              imageUrl: relationUser.imageUrl,
              userId: accountValues.id
            }
          }),
        ...relations
          .filter(
            relation =>
              relation.userId2 === accountValues.id &&
              relation.status === 'FRIENDS'
          )
          .map(filteredRelation => {
            let relationUser = relationsUsers.find(
              user => user._id === filteredRelation.userId1
            )

            if (!relationUser || Object.keys(relationUser).length === 0)
              return {}

            return {
              id: filteredRelation.userId1,
              name: relationUser.name,
              email: relationUser.email,
              imageUrl: relationUser.imageUrl,
              userId: accountValues.id
            }
          })
      ])

      handleFriendCountChange(friends.length)
    }
  }, [
    relations,
    relationsUsers,
    accountValues.id,
    friends.length,
    handleFriendCountChange
  ])

  return (
    <>
      <List>
        {/* Ensure this portion does not render before all the data is in, to prevent duplicate key warning (all NaN) */}
        {Object.keys(friends).length > 0 &&
        Object.keys(friends[0]).length > 0 ? (
          friends.map(user => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar
                  src={user.imageUrl}
                  alt={user.name}
                  className={classes.avatar}
                >
                  {user.name[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />
              <ListItemSecondaryAction>
                <Tooltip title='Remove Friend'>
                  <IconButton
                    edge='end'
                    aria-label='Remove Request'
                    onClick={() => {
                      handleFriendRemoveModalOpen(user)
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
            <Typography>No friends added...</Typography>
          </div>
        )}
      </List>

      {/* Modal component for confirming to delete friend */}
      <Dialog
        open={bModalOpen}
        onClose={handleFriendRemoveModalClose}
        aria-labelledby='send-friend-remove-title'
        aria-describedby='send-friend-remove-description'
      >
        <div className={classes.dialog}>
          <DialogTitle id='send-friend-remove'>{'Remove Friend'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Are you sure you want to remove{' '}
              <span style={{ color: 'red' }}>{friendRemoveUser.name}</span> from
              your friends list?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFriendRemoveModalClose} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={handleFriendRemoveSubmit}
              color='primary'
              autoFocus
            >
              Confirm
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  )
}

export default FriendsComponent
