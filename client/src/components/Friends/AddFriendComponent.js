import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
} from '@material-ui/core'

import SendIcon from '@material-ui/icons/Send'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import BlockIcon from '@material-ui/icons/Block'

const useStyles = makeStyles(theme => ({
  noResults: {
    textAlign: 'center',
    color: 'gray'
  },
  avatar: {
    border: '1px solid black'
  },
  adornedEnd: {
    paddingRight: 0
  },
  dialog: {
    margin: theme.spacing(1)
  }
}))

const AddFriendComponent = ({
  accountValues,
  relations,
  relationsUsers,
  setSnackbarOpen,
  setSnackBarMessage,
  reloadRelations,
  handleBlacklistModalOpen
}) => {
  const classes = useStyles()

  const [searchValue, setSearchValue] = useState('')
  const [searchResults, setSearchResults] = useState([])

  // Use this to filter out user ids from being able to be searched as part of blacklist
  const [blockedIds, setBlockedIds] = useState([])

  // Set boolean variable for checking if search results are loading
  const [bLoading, setBLoading] = useState(false)
  // Set boolean variable to display "No results" only after making at least one search
  const [bSearched, setBSearched] = useState(false)

  // Set boolean variable for opening modal
  const [bModalOpen, setBModalOpen] = useState(false)
  // User that is being sent a friend request
  const [friendRequestUser, setFriendRequestUser] = useState({})
  // Friend Request message
  const [friendRequestMessage, setFriendRequestMessage] = useState(
    "Let's be friends! ^-^"
  )

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      handleSearchSubmit()
    }
  }

  const handleSearchValueChange = event => {
    setSearchValue(event.target.value)
  }

  const handleSearchSubmit = () => {
    if (searchValue.length > 0) {
      setBLoading(true)

      axios
        .get(`/users/find/${searchValue}`)
        .then(res => {
          setSearchResults(res.data)
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => {
          if (!bSearched) setBSearched(true)
          setBLoading(false)
        })
    }
  }

  const handleFriendRequestModalOpen = user => {
    // Set friend request user to selected
    setFriendRequestUser(user)
    setBModalOpen(true)
  }

  const handleFriendRequestModalClose = () => {
    setBModalOpen(false)
    // Reset friend request message and user
    // Added a small delay so you do not see the values resetting as the modal is fading
    setTimeout(() => {
      setFriendRequestMessage("Let's be friends! ^-^")
      setFriendRequestUser({})
    }, 500)
  }

  const handleFriendRequestMessageChange = event => {
    setFriendRequestMessage(event.target.value)
  }

  const handleFriendRequestSubmit = () => {
    if (searchValue.length > 0) {
      axios
        .post('/users/add/', {
          // userId1 uses .id because the underline is removed when initially storing (and then retrieving) this data to/from the cookie
          // userId2 uses ._id as it is directly retrieved from MongoDB
          userId1: accountValues.id,
          userId2: friendRequestUser._id,
          message: friendRequestMessage
        })
        .then(res => {
          reloadRelations()
          handleFriendRequestModalClose()
        })
        .catch(err => {
          setSnackbarOpen(true)
          setSnackBarMessage(err.response.data)
        })
        .finally(() => {})
    }
  }

  useEffect(() => {
    if (relations && relationsUsers) {
      setBlockedIds(
        relations
          .filter(relation => relation.status.includes('BLOCKED'))
          .map(filteredRelation => {
            let relationUser = relationsUsers.find(
              user =>
                user._id ===
                (filteredRelation.userId1 === accountValues.id
                  ? filteredRelation.userId2
                  : filteredRelation.userId1)
            )

            if (!relationUser || Object.keys(relationUser).length === 0)
              return ''
            else if (filteredRelation.userId1 === accountValues.id)
              return filteredRelation.userId2
            else return filteredRelation.userId1
          })
      )
    }
  }, [accountValues.id, relations, relationsUsers])

  return (
    <>
      <TextField
        variant='outlined'
        margin='dense'
        fullWidth
        autoFocus
        placeholder='Search by name or email address'
        disabled={bLoading}
        onKeyDown={handleKeyPress}
        onChange={handleSearchValueChange}
        InputProps={{
          endAdornment: (
            <Button
              variant='contained'
              color='primary'
              disabled={bLoading}
              onClick={handleSearchSubmit}
              edge='end'
            >
              <SendIcon />
            </Button>
          ),
          classes: {
            adornedEnd: classes.adornedEnd
          }
        }}
      ></TextField>
      <List>
        <div className={classes.noResults}>
          {searchResults.filter(result => !blockedIds.includes(result._id))
            .length === 0 && bSearched ? (
            <Typography>No results</Typography>
          ) : (
            <></>
          )}
        </div>
        {searchResults
          .filter(result => !blockedIds.includes(result._id))
          .map(user => (
            <ListItem key={user._id}>
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
                <Tooltip title='Block User'>
                  <IconButton
                    edge='end'
                    aria-label='Block User'
                    onClick={() => {
                      handleBlacklistModalOpen(user)
                    }}
                  >
                    <BlockIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Send Friend Request'>
                  <IconButton
                    edge='end'
                    aria-label='Send Friend Request'
                    onClick={() => {
                      handleFriendRequestModalOpen(user)
                    }}
                  >
                    <PersonAddIcon />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
      </List>

      {/* Modal component for confirming to send Friend Request */}
      <Dialog
        open={bModalOpen}
        onClose={handleFriendRequestModalClose}
        aria-labelledby='send-friend-request-title'
        aria-describedby='send-friend-request-description'
      >
        <div className={classes.dialog}>
          <DialogTitle id='send-friend-request'>{'Add as Friend'}</DialogTitle>
          <DialogContent>
            <DialogContentText id='alert-dialog-description'>
              Send friend request to{' '}
              <span style={{ color: 'orange' }}>{friendRequestUser.name}</span>
            </DialogContentText>
            <TextField
              variant='outlined'
              margin='dense'
              fullWidth
              value={friendRequestMessage}
              onChange={handleFriendRequestMessageChange}
              placeholder='Type message here...'
            ></TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFriendRequestModalClose} color='primary'>
              Cancel
            </Button>
            <Button
              onClick={handleFriendRequestSubmit}
              color='primary'
              autoFocus
            >
              Send Friend Request
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  )
}

export default AddFriendComponent
