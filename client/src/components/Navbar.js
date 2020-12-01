import React, { useState, useRef } from 'react'
import { withRouter, Link, useHistory } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  Divider
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

const Navbar = ({ location, state, accountValues, logout }) => {
  const classes = useStyles()
  const theme = useTheme()
  const history = useHistory()
  const bBreakpointUpSm = useMediaQuery(theme.breakpoints.up('sm'))

  const anchorRef = useRef(null)
  const [bMenuOpen, setBMenuOpen] = useState(false)

  const handleMenuToggle = () => {
    setBMenuOpen(prevOpen => !prevOpen)
  }

  const handleMenuClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setBMenuOpen(false)
  }

  const handleListKeyDown = event => {
    if (event.key === 'Tab') {
      event.preventDefault()
      setBMenuOpen(false)
    }
  }

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
            justify={bBreakpointUpSm ? 'center' : 'flex-start'}
          >
            <Link
              to={accountValues.id ? '/match' : '/login'}
              className={classes.brandTitle}
            >
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
                    accountValues.imageUrl &&
                    accountValues.imageUrl !== undefined
                      ? `${accountValues.imageUrl}?${Date.now()}`
                      : ''
                  }
                  alt={accountValues.name || ''}
                >
                  {accountValues.name[0]}
                </Avatar>
                <Button
                  ref={anchorRef}
                  onClick={handleMenuToggle}
                  endIcon={<ArrowDropDown />}
                >
                  My Profile
                </Button>
                <Popper
                  open={bMenuOpen}
                  anchorEl={anchorRef.current}
                  // Place anchor at the bottom right of the button
                  placement='bottom-end'
                  // Support grow transition
                  transition
                  // Persist z-index from navbar
                  disablePortal
                >
                  {({ TransitionProps }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        // Handle from which part of the menu it will grow from
                        transformOrigin: 'right top'
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleMenuClose}>
                          <MenuList
                            autoFocusItem={bMenuOpen}
                            onKeyDown={handleListKeyDown}
                          >
                            <MenuItem
                              component={Link}
                              to={'/profile'}
                              onClick={handleMenuClose}
                            >
                              Profile
                            </MenuItem>
                            <MenuItem
                              component={Link}
                              to={'/friends'}
                              onClick={handleMenuClose}
                            >
                              Friends
                            </MenuItem>
                            <Divider />
                            <MenuItem
                              onClick={event => {
                                logout()
                                  .then(() => {})
                                  .catch(() => {})
                                  .finally(() => {
                                    handleMenuClose(event)
                                    // Redirect to login page
                                    history.push('/login')
                                  })
                              }}
                            >
                              Logout
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
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
