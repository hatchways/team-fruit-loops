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
  Divider,
  Hidden,
  Dialog,
  DialogTitle,
  DialogContent,
  MobileStepper,
} from '@material-ui/core'

import {
  ArrowDropDown,
  Search,
  Menu,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons'

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
  const [activeStep, setActiveStep] = useState(0)

  const tutorialSteps = [
    {
      label: 'San Francisco – Oakland Bay Bridge, United States',
      imgPath:
        '../assets/33c6855690c57cf64146078caae5b4bce840e62e.png'
    },
    {
      label: 'Bird',
      imgPath:
        'https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60'
    },
    {
      label: 'Bali, Indonesia',
      imgPath:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      label: 'NeONBRAND Digital Marketing, Las Vegas, United States',
      imgPath:
        'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60'
    },
    {
      label: 'Goč, Serbia',
      imgPath:
        'https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60'
    }
  ]

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
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
      <Dialog open={false}>
        <div>
          <DialogTitle id='how-to-play'>{'How to Play'}</DialogTitle>
          <DialogContent>
            <Paper square elevation={0} className={classes.header}>
              <Typography>{tutorialSteps[activeStep].label}</Typography>
            </Paper>
            <img
              className={classes.img}
              src={tutorialSteps[activeStep].imgPath}
              alt={tutorialSteps[activeStep].label}
            />
            <MobileStepper
              variant='dots'
              steps={6}
              position='static'
              activeStep={activeStep}
              className={classes.root}
              nextButton={
                <Button
                  size='small'
                  onClick={handleNext}
                  disabled={activeStep === 5}
                >
                  Next
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size='small'
                  onClick={handleBack}
                  disabled={activeStep === 0}
                >
                  {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                  Back
                </Button>
              }
            />
          </DialogContent>
        </div>
      </Dialog>
    </AppBar>
  )
}

Scorecard.propTypes = {
  score: PropTypes.number,
  team: PropTypes.string,
}

Navbar.propTypes = {
  state: PropTypes.object,
  accountValues: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

export default withRouter(Navbar)
