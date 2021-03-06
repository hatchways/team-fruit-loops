import React, { useState } from 'react'
import { withRouter, Link, useHistory } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import {
  AppBar,
  Avatar,
  Button,
  Divider,
  Grid,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@material-ui/core'
import { ArrowDropDown, Menu as MenuIcon, Search } from '@material-ui/icons'

const appBarHeight = '10vh'

const styles = theme => ({
  root: {
    zIndex: 1300,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  toolbar: {
    height: appBarHeight,
    width: '100vw'
  },
  inset: {
    width: 'auto'
  },
  navEnd: {
    width: 'auto'
  },
  profile: {},
  game: {
    display: 'block',
    backgroundColor: 'rgb(38, 182, 92);',
    color: 'white',
    marginRight: theme.spacing(3)
  },
  hDivider: {
    height: '2px',
    width: theme.spacing(2),
    backgroundColor: 'black',
    marginTop: '3vh;'
  },
  red: {
    color: 'rgb(233, 97, 94);'
  },
  blue: {
    color: 'rgb(99, 176, 244);'
  },
  points: {
    fontWeight: 'bold'
  }
})

const Scorecard = ({ classes, score, team }) => (
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

const Navbar = ({ classes, state, onRestart, accountValues, logout }) => {
  const history = useHistory()

  const {
    gameState: { bluePoints, redPoints }
  } = state
  const [miniMenu, setMiniMenu] = useState(null)
  const [fullMenu, setFullMenu] = useState(null)
  const toggleMenu = type => ({ currentTarget }) =>
    type === 'full'
      ? setFullMenu(fullMenu === null ? currentTarget : null)
      : setMiniMenu(miniMenu === null ? currentTarget : null)

  return (
    <AppBar className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Grid container justify='space-between' alignItems='center'>
          <Hidden mdUp>
            <Search />
          </Hidden>
          <Hidden smDown>
            <Typography variant='h1'>CLUEWORDS</Typography>
          </Hidden>
          <Grid
            item
            container
            direction='row'
            justify='center'
            className={classes.inset}
          >
            <Scorecard classes={classes} score={bluePoints} team='Blue Team' />
            <Divider className={classes.hDivider} variant='middle' />
            <Scorecard classes={classes} score={redPoints} team='Red Team' />
          </Grid>
          <Hidden mdUp>
            <IconButton onClick={toggleMenu('mini')}>
              <MenuIcon />
            </IconButton>
          </Hidden>
          <Hidden smDown>
            <Grid item container className={classes.navEnd}>
              <Button
                onClick={() => onRestart()}
                className={classes.game}
                variant='outlined'
              >
                Restart
              </Button>
              {accountValues && accountValues.name ? (
                <Avatar
                  src={
                    accountValues.imageUrl &&
                    accountValues.imageUrl !== undefined
                      ? `${accountValues.imageUrl}?${Date.now()}`
                      : ''
                  }
                  alt={accountValues.name || ''}
                />
              ) : (
                <></>
              )}

              <Button
                onClick={toggleMenu('full')}
                className={classes.profile}
                endIcon={<ArrowDropDown />}
              >
                My Profile
              </Button>
            </Grid>
          </Hidden>
        </Grid>
        <Menu
          keepMounted
          id='full-menu'
          anchorEl={fullMenu}
          open={Boolean(fullMenu)}
          onClose={toggleMenu('full')}
        >
          <MenuItem
            component={Link}
            to={'/profile'}
            target='_blank'
            onClick={toggleMenu('full')}
          >
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to={'/friends'}
            target='_blank'
            onClick={toggleMenu('full')}
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
                  toggleMenu('full')
                  // Redirect to login page
                  history.push('/login')
                })
            }}
          >
            Logout
          </MenuItem>
        </Menu>
        <Menu
          keepMounted
          id='mini-menu'
          anchorEl={miniMenu}
          open={Boolean(miniMenu)}
          onClose={toggleMenu('mini')}
        >
          <MenuItem selected={false} onClick={() => onRestart()}>
            Restart
          </MenuItem>
          <MenuItem
            component={Link}
            to={'/profile'}
            target='_blank'
            onClick={toggleMenu('mini')}
          >
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to={'/friends'}
            target='_blank'
            onClick={toggleMenu('mini')}
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
                  toggleMenu('mini')
                  // Redirect to login page
                  history.push('/login')
                })
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

const GameNavbar = withRouter(withStyles(styles)(Navbar))

export { GameNavbar as default, appBarHeight }
