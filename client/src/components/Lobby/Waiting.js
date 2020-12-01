import React from 'react'
import {
  Grid,
  List,
  ListItem,
  // ListItemAvatar,
  // Avatar,
  ListItemText
} from '@material-ui/core'

const LobbyWaiting = ({ state }) => {
  const player = state.player
  const waitingList = state.gameState.waitingList

  return (
    <Grid container item xs={12}>
      <List>
        {waitingList.map((user, index) => (
          <ListItem key={index}>
            {/* <ListItemAvatar>
              <Avatar></Avatar>
            </ListItemAvatar> */}
            <ListItemText
              style={{
                color: player === user ? 'green' : ''
              }}
              primary={user}
            />
          </ListItem>
        ))}
      </List>
    </Grid>
  )
}

export default LobbyWaiting
