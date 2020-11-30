import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'

import {
  Container,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert'

// Import components that make up the tab content
import FriendsComponent from '../components/Friends/FriendsComponent'
import AddFriendComponent from '../components/Friends/AddFriendComponent'
import FriendRequestsComponent from '../components/Friends/FriendRequestsComponent'
import BlacklistComponent from '../components/Friends/BlacklistComponent'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(3, 5)
  },
  content: {
    padding: theme.spacing(2)
  }
}))

const Alert = props => {
  return <MuiAlert elevation={6} variant='filled' {...props} />
}

const Friends = props => {
  const classes = useStyles()

  // Control which tab is currently selected
  const [tabIndex, setTabIndex] = useState(0)
  // Hold data from the relations collection, filtered to all relations of the logged in user (HTTP call)
  const [relations, setRelations] = useState([])
  // Hold data from the users collection, based on searching all ids in the relations state variable (another HTTP call)
  const [relationsUsers, setRelationsUsers] = useState([])

  // Counters to display on tabs
  const [friendCount, setFriendCount] = useState(null)
  const [incomingFriendRequestCount, setIncomingFriendRequestCount] = useState(
    null
  )
  const [blacklistCount, setBlackListCount] = useState(null)

  // Handle Blacklist confirmation modal
  const [bBlacklistModalOpen, setBBlacklistModalOpen] = useState(false)
  const [blockUser, setBlockUser] = useState({})

  // Handle Alert states (error messages)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackBarMessage] = useState('')

  const handleFriendCountChange = value => {
    setFriendCount(value)
  }

  const handleIncomingFriendRequestCountChange = value => {
    setIncomingFriendRequestCount(value)
  }

  const handleBlacklistCountChange = value => {
    setBlackListCount(value)
  }

  const handleTabIndexChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  // Blacklist functions
  const handleBlacklistModalOpen = user => {
    // Set block user to selected
    setBlockUser(user)
    setBBlacklistModalOpen(true)
  }

  const handleBlacklistModalClose = user => {
    setBBlacklistModalOpen(false)
    // Added a small delay so you do not see the values resetting as the modal is fading
    setTimeout(() => {
      setBlockUser({})
    }, 500)
  }

  // Alert error message handler
  const handleSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbarOpen(false)
  }

  const handleBlacklistSubmit = () => {
    axios
      .patch('/users/blacklist', {
        userId1: props.accountValues.id,
        userId2: blockUser._id
      })
      .then(() => {
        handleBlacklistModalClose()
        reloadRelations()
      })
      .catch(err => {
        setSnackbarOpen(true)
        setSnackBarMessage(err.response.data)
      })
  }

  // Function to reload the relations state
  // Use callback function to prevent being recreated and causing infinite loop when called in useEffect
  const reloadRelations = useCallback(() => {
    axios
      .get(`/users/relations/${props.accountValues.id}`)
      .then(res => {
        setRelations(res.data)
      })
      .catch(err => {
        setSnackbarOpen(true)
        setSnackBarMessage(err.response.data)
      })
  }, [props.accountValues.id])

  // This useEffect gets the data from the relations collection based on logged in user id
  // Should only render once as props.accountValues.id shouldn't change
  useEffect(() => {
    reloadRelations()
  }, [reloadRelations])

  // This useEffect gets the data from the users collection based on any user ids found in the relations state set above
  // Should render multiple times based on changes made to relations
  useEffect(() => {
    if (relations.length > 0) {
      // Get all unique user ids from the relations of the user
      let usersIdArray = []

      relations.forEach(relation => {
        if (!usersIdArray.includes(relation.userId1))
          usersIdArray.push(relation.userId1)
        if (!usersIdArray.includes(relation.userId2))
          usersIdArray.push(relation.userId2)
      })

      axios
        .get('/users/findManyByIds', { params: { userIds: usersIdArray } })
        .then(res => {
          setRelationsUsers(res.data)
        })
        .catch(err => console.log(err))
    }
  }, [relations])

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.root}>
        <Paper>
          <Tabs
            value={tabIndex}
            indicatorColor='primary'
            textColor='primary'
            variant='scrollable'
            scrollButtons='on'
            onChange={handleTabIndexChange}
            aria-label='Friends Tabs'
          >
            <Tab label={`Friends ${friendCount ? `(${friendCount})` : ''}`} />
            <Tab label='Add Friend' />
            <Tab
              label={`Friend Requests ${
                incomingFriendRequestCount
                  ? `(${incomingFriendRequestCount})`
                  : ''
              }`}
            />
            <Tab
              label={`Blacklist ${blacklistCount ? `(${blacklistCount})` : ''}`}
            />
          </Tabs>

          {/* ISSUE: Need to determine a way to only show content once all states are fully loaded */}
          <div className={classes.content}>
            {/* Display appropriate component based on tab index */}
            <div hidden={tabIndex !== 0}>
              <FriendsComponent
                {...props}
                relations={relations}
                relationsUsers={relationsUsers}
                setSnackbarOpen={setSnackbarOpen}
                setSnackBarMessage={setSnackBarMessage}
                reloadRelations={reloadRelations}
                handleFriendCountChange={handleFriendCountChange}
              />
            </div>
            <div hidden={tabIndex !== 1}>
              <AddFriendComponent
                {...props}
                relations={relations}
                relationsUsers={relationsUsers}
                setSnackbarOpen={setSnackbarOpen}
                setSnackBarMessage={setSnackBarMessage}
                reloadRelations={reloadRelations}
                handleBlacklistModalOpen={handleBlacklistModalOpen}
              />
            </div>
            <div hidden={tabIndex !== 2}>
              <FriendRequestsComponent
                {...props}
                relations={relations}
                relationsUsers={relationsUsers}
                reloadRelations={reloadRelations}
                handleIncomingFriendRequestCountChange={
                  handleIncomingFriendRequestCountChange
                }
              />
            </div>
            <div hidden={tabIndex !== 3}>
              <BlacklistComponent
                {...props}
                relations={relations}
                relationsUsers={relationsUsers}
                reloadRelations={reloadRelations}
                handleBlacklistCountChange={handleBlacklistCountChange}
              />
            </div>
          </div>
        </Paper>
      </div>

      {/* Modal component for blacklisting a user (can be opened from Friends or Add Friend components */}
      <Dialog
        open={bBlacklistModalOpen}
        onClose={handleBlacklistModalClose}
        aria-labelledby='blacklist-title'
        aria-describedby='blacklist-description'
      >
        <DialogTitle id='blacklist-request'>{'Blacklist User'}</DialogTitle>
        <DialogContent>
          <DialogContentText id='blacklist-description'>
            Are you sure you want to block{' '}
            <span style={{ color: 'red' }}>{blockUser.name}</span>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBlacklistModalClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleBlacklistSubmit} color='primary' autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbar}
      >
        <Alert onClose={handleSnackbar} severity='error'>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default Friends
