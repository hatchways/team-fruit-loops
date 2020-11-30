import React from 'react'
import { Link, useHistory } from 'react-router-dom'

import { Grid, Button, Container } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '0 0 5px 0',
    padding: theme.spacing(3, 5),
    backgroundColor: 'white'
  },
  formButton: {
    display: 'flex',
    margin: '24px auto 32px',
    textTransform: 'none',
    backgroundColor: '#32BE72',
    color: 'white',
    width: '120px',
    height: '40px'
  },
  startGameButton: {
    textTransform: 'none',
    background:
      'linear-gradient(to bottom right, rgb(3, 94, 252), rgb(0, 39, 107))',
    width: '300px',
    height: '75px',
    border: '3px outset gray',
    fontSize: '2.5em',
    color: 'white',
    WebkitTextStroke: '1.5px black',
    '&:hover': {
      background: 'rgb(176, 176, 176)'
    }
  },
  profileButton: {
    textTransform: 'none',
    background:
      'linear-gradient(to bottom right, rgb(209, 159, 84), rgb(176, 122, 40))',
    width: '150px',
    height: '50px',
    border: '3px outset gray',
    fontSize: '2em',
    color: 'white',
    WebkitTextStroke: '1px black',
    '&:hover': {
      background: 'rgb(176, 176, 176)'
    }
  },
  friendsButton: {
    textTransform: 'none',
    background:
      'linear-gradient(to bottom right, rgb(0, 176, 50), rgb(0, 120, 34))',
    width: '150px',
    height: '50px',
    border: '3px outset gray',
    fontSize: '2em',
    color: 'white',
    WebkitTextStroke: '1px black',
    '&:hover': {
      background: 'rgb(176, 176, 176)'
    }
  },
  logoutButton: {
    textTransform: 'none',
    background:
      'linear-gradient(to bottom right, rgb(255, 110, 117), rgb(209, 84, 90))',
    width: '150px',
    height: '35px',
    border: '3px outset gray',
    fontSize: '2em',
    color: 'white',
    WebkitTextStroke: '1px black',
    '&:hover': {
      background: 'rgb(176, 176, 176)'
    }
  }
}))

const Menu = ({ handleAccountValuesChange, logout }) => {
  const classes = useStyles()
  const history = useHistory()

  return (
    <Container component='main' maxWidth='xs'>
      <div className={classes.root}>
        <Grid
          container
          direction='column'
          justify='center'
          alignItems='center'
          spacing={2}
        >
          <Grid item>
            <Button
              variant='contained'
              component={Link}
              to={'/match'}
              className={classes.startGameButton}
            >
              Start Game
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              component={Link}
              to={'/profile'}
              className={classes.profileButton}
            >
              Profile
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              component={Link}
              to={'/friends'}
              className={classes.friendsButton}
            >
              Friends
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant='contained'
              onClick={() => {
                logout()
                  .then(() => {})
                  .catch(() => {})
                  .finally(() => {
                    // Redirect to login page
                    history.push('/login')
                  })
              }}
              className={classes.logoutButton}
            >
              Logout
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  )
}

export default Menu
