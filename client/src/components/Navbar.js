import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar, Toolbar, Typography } from '@material-ui/core'

import GameNavbar from './Game/Nav'

const useStyles = makeStyles(theme => ({
  root: {
    alignItems: 'center',
    zIndex: 1300,
    backgroundColor: 'white',
    // height: '10vh'
  },
  link: {
    textDecoration: "none"
  }
}))

const Navbar = ({ location, state, accountValues }) => {
  const classes = useStyles()

  // ISSUE: accountValues is not passing to the GameNavbar (stays as undefined)
  if (location.pathname === '/game') {
    return <GameNavbar state={state} classes={classes} accountValues={accountValues} />
  }

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Link to='/match' className={classes.link}><Typography variant='h1'>CLUEWORDS</Typography></Link>
      </Toolbar>
    </AppBar>
  )
}

export default withRouter(Navbar)
