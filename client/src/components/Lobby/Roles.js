import React from 'react'
import { Grid, Typography, IconButton } from '@material-ui/core'
import { AddCircle } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

// map backend state -> frontend text
const lookup = {
  'red spy': 'Red Spy Master',
  'blue spy': 'Blue Spy Master',
  'red guesser': 'Red Field Agent',
  'blue guesser': 'Blue Field Agent'
}

const useStyles = makeStyles(theme => ({
  role: {
    textAlign: 'center'
  },
  roleText: {
    width: "100px"
  },
  unavailable: {
    color: 'gray',
  }
}))

const Role = ({ onAssign, disabled, role }) => {
  const classes = useStyles({role: role})

  const click = role => e => {
    e.preventDefault()
    if (!disabled) {
      onAssign(role)
    }
  }

  return (
    <Grid container item xs={12} className={classes.role} justify="center" alignItems="center">
      <Grid item>
        <Typography align='center' className={`${classes.roleText} ${disabled ? classes.unavailable : undefined}`}>
          {lookup[role]}
        </Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={click(role)} disabled={disabled}>
          <AddCircle />
        </IconButton>
      </Grid>
    </Grid>
  )
}

const LobbyRoles = ({
  onAssign,
  off,
  state: {
    gameState: { redSpy, blueSpy }
  }
}) => {
  return (
    <Grid container justify='flex-start' direction='column'>
      <Grid item>
        <Role role='blue spy' onAssign={onAssign} disabled={off || blueSpy !== undefined} />
      </Grid>
      <Grid item>
        <Role role='red spy' onAssign={onAssign} disabled={off || redSpy !== undefined} />
      </Grid>
      <Grid item>
        <Role role='blue guesser' onAssign={onAssign} disabled={off} />
      </Grid>
      <Grid item>
        <Role role='red guesser' onAssign={onAssign} disabled={off} />
      </Grid>
    </Grid>
  )
}

export default LobbyRoles
