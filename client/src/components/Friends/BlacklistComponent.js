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

import CancelIcon from '@material-ui/icons/Cancel'

const useStyles = makeStyles(theme => ({
  noResults: {
    textAlign: 'center',
    color: 'gray'
  },
  avatar: {
    border: '1px solid black'
  }
}))

const BlacklistComponent = ({
  accountValues,
  relations,
  relationsUsers,
  handleBlacklistCountChange,
  reloadRelations
}) => {
  const classes = useStyles()

  const [blockedUsers, setBlockedUsers] = useState([])

  const handleUnblock = user => {
    // DELETE requests have to pass to data instead of regular payload
    axios
      .delete('/users/remove', {
        data: {
          sender: accountValues.id,
          receiver: user.id
        }
      })
      .then(() => {
        reloadRelations()
      })
      .catch(() => {})
  }

  useEffect(() => {
    if (relations && relationsUsers) {
      setBlockedUsers([
        ...relations
          .filter(
            relation =>
              relation.userId1 === accountValues.id &&
              relation.status === 'BLOCKED_1_TO_2'
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
              relation.status === 'BLOCKED_2_TO_1'
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

      handleBlacklistCountChange(blockedUsers.length)
    }
  }, [
    relations,
    relationsUsers,
    accountValues.id,
    blockedUsers.length,
    handleBlacklistCountChange
  ])

  return (
    <>
      <List>
        {/* Ensure this portion does not render before all the data is in, to prevent duplicate key warning (all NaN) */}
        {Object.keys(blockedUsers).length > 0 &&
        Object.keys(blockedUsers[0]).length > 0 ? (
          blockedUsers.map(user => (
            <ListItem key={user.id}>
              <ListItemAvatar>
                <Avatar
                  src={user.imageUrl}
                  alt={user.name || ''}
                  className={classes.avatar}
                >
                  {(user.name && user.name[0]) || ''}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={user.name || ''} secondary={user.email} />
              <ListItemSecondaryAction>
                <Tooltip title='Unblock User'>
                  <IconButton
                    edge='end'
                    aria-label='Unblock User'
                    onClick={() => {
                      handleUnblock(user)
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
            <Typography>No blocked users</Typography>
          </div>
        )}
      </List>
    </>
  )
}

export default BlacklistComponent
