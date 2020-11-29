import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Button,
  Avatar
} from '@material-ui/core'

import { ArrowDropDown } from '@material-ui/icons'

import GameNavbar from './Game/Nav'

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 1300,
    backgroundColor: 'white'
  },
  brand: {},
  brandTitle: {
    textDecoration: 'none'
  },
  navEnd: {},
  container: {}
}))

const Navbar = ({ location, state, accountValues }) => {
  const classes = useStyles()
  const theme = useTheme()
  const bBreakpointUpXs = useMediaQuery(theme.breakpoints.up('xs'))

  // ISSUE: accountValues is not passing to the GameNavbar (stays as undefined)
  if (location.pathname === '/game') {
    return (
      <GameNavbar
        state={state}
        classes={classes}
        accountValues={accountValues}
      />
    )
  }

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Grid container justify='space-between' alignItems='center'>
          <Grid
            item
            container
            xs={'auto'}
            sm={4}
            className={classes.container}
          ></Grid>
          <Grid
            item
            container
            xs={6}
            sm={4}
            className={`${classes.container} ${classes.brand}`}
            justify={bBreakpointUpXs ? 'center' : 'flex-start'}
          >
            <Link to='/match' className={classes.brandTitle}>
              <Typography variant='h1'>CLUEWORDS</Typography>
            </Link>
          </Grid>
          <Grid
            item
            container
            xs={6}
            sm={4}
            className={`${classes.navEnd} ${classes.container}`}
            justify='flex-end'
          >
            {accountValues.id ? (
              <>
                <Avatar
                  src={
                    accountValues.imageUrl &&  accountValues.imageUrl !== undefined
                      ? `${accountValues.imageUrl}?${Date.now()}`
                      : ''
                  }
                  alt={accountValues.name || ''}
                />
                <Button
                  onClick={() => {}}
                  className={classes.profile}
                  endIcon={<ArrowDropDown />}
                >
                  My Profile
                </Button>
              </>
            ) : (
              <></>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default withRouter(Navbar)
