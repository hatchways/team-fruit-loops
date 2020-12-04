import React, { useState, useRef } from 'react'
import { withRouter, Link, useHistory } from 'react-router-dom'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import TutorialComponent from './TutorialComponent'

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
  Divider,
  Hidden
} from '@material-ui/core'

import { ArrowDropDown, Search, Menu } from '@material-ui/icons'

import PropTypes from 'prop-types'

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
  container: {},

  red: {
    color: 'rgb(233, 97, 94)'
  },
  hDivider: {
    height: '2px',
    width: theme.spacing(2),
    backgroundColor: 'black'
  },
  blue: {
    color: 'rgb(99, 176, 244)'
  },
  points: {
    fontWeight: 'bold'
  },
  tutorialHeader: {
    textAlign: 'center'
  },
  tutorialImage: {
    width: '100%'
  }
}))

const Scorecard = ({ score, team }) => {
  const classes = useStyles()

  return (
    <div
      className={Object.entries({
        [classes.points]: true,
        [classes.red]: team === 'Red Team',
        [classes.blue]: team === 'Blue Team'
      }).reduce((css, [k, v]) => css + (v === true ? k + ' ' : ''), '')}
    >
      <Typography align='center' className={classes.points}>
        {score}
      </Typography>
      <Typography className={classes.points}>{team}</Typography>
    </div>
  )
}

const Navbar = ({ state, accountValues, logout }) => {
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

  // How to Play Modal handlers
  const [bModalOpen, setBModalOpen] = useState(false)

  const handleModalOpen = () => {
    setBModalOpen(true)
  }

  const handleModalClose = () => {
    setBModalOpen(false)
  }

  return (
    <AppBar className={classes.root}>
      <Toolbar>
        <Grid container justify='space-between' alignItems='center'>
          {!state.gameState || !state.gameState.isStart ? (
            <>
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
            </>
          ) : (
            <>
              <Grid
                item
                container
                xs={2}
                sm={4}
                className={`${classes.container} ${classes.brand}`}
                justify='flex-start'
              >
                <Hidden smUp>
                  <Search />
                </Hidden>
                <Hidden xsDown>
                  <Typography variant='h1'>CLUEWORDS</Typography>
                </Hidden>
              </Grid>
              <Grid
                item
                container
                xs={8}
                sm={4}
                className={classes.container}
                justify='center'
              >
                <Grid item container justify='center'>
                  <Typography className={classes.points}>
                    Words remaining
                  </Typography>
                </Grid>
                <Grid item container justify='center'>
                  <Scorecard
                    score={state.gameState.bluePoints}
                    team='Blue Team'
                  />
                  <Typography variant='h1'>-</Typography>
                  <Scorecard
                    score={state.gameState.redPoints}
                    team='Red Team'
                  />
                </Grid>
              </Grid>
            </>
          )}

          <Grid
            item
            container
            xs={!state.gameState || !state.gameState.isStart ? 6 : 2}
            sm={4}
            className={`${classes.navEnd} ${classes.container}`}
            justify='flex-end'
          >
            {accountValues.id ? (
              <>
                {!state.gameState ||
                !state.gameState.isStart ||
                bBreakpointUpSm ? (
                  <Avatar
                    src={
                      accountValues.imageUrl &&
                      accountValues.imageUrl !== undefined
                        ? `${accountValues.imageUrl}?${Date.now()}`
                        : ''
                    }
                    alt={accountValues.name || ''}
                  ></Avatar>
                ) : (
                  <></>
                )}
                <Button
                  ref={anchorRef}
                  onClick={handleMenuToggle}
                  endIcon={
                    !state.gameState ||
                    !state.gameState.isStart ||
                    bBreakpointUpSm ? (
                      <ArrowDropDown />
                    ) : (
                      <Menu />
                    )
                  }
                >
                  {!state.gameState ||
                  !state.gameState.isStart ||
                  bBreakpointUpSm
                    ? 'My Profile'
                    : ''}
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
                              target={
                                !state.gameState || !state.gameState.isStart
                                  ? undefined
                                  : '_target'
                              }
                              onClick={handleMenuClose}
                            >
                              Profile
                            </MenuItem>
                            <MenuItem
                              component={Link}
                              to={'/friends'}
                              target={
                                !state.gameState || !state.gameState.isStart
                                  ? undefined
                                  : '_target'
                              }
                              onClick={handleMenuClose}
                            >
                              Friends
                            </MenuItem>
                            <Divider />
                            <MenuItem
                              onClick={(event) => {
                                handleModalOpen()
                                handleMenuClose(event)
                              }}
                            >
                              How to Play
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
      {/* Modal component for How to Play */}
      <TutorialComponent
        bModalOpen={bModalOpen}
        handleModalOpen={handleModalOpen}
        handleModalClose={handleModalClose}
      />
    </AppBar>
  )
}

Scorecard.propTypes = {
  score: PropTypes.number,
  team: PropTypes.string
}

Navbar.propTypes = {
  state: PropTypes.object,
  accountValues: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default withRouter(Navbar)
