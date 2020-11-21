import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Avatar,
  Hidden,
  IconButton,
  Menu, MenuItem,
  Toolbar,
  Typography,
  Divider,
  Grid,
  Button,
} from "@material-ui/core";
import {
  ArrowDropDown,
  Menu as MenuIcon,
  Search,
} from "@material-ui/icons";

const appBarHeight = "10vh";

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 1300,
    backgroundColor: "white",
    alignItems: "center",
  },
  toolbar: {
    height: appBarHeight,
    width: "100vw",
  },
  inset: {
    width: "auto",
  },
  navEnd: {
    width: "auto",
  },
  profile: {
  },
  game: {
    display: "block",
    backgroundColor: "rgb(38, 182, 92);",
    color: "white",
    marginRight: theme.spacing(3),
  },
  hDivider: {
    height: "2px",
    width: theme.spacing(2),
    backgroundColor: "black",
    marginTop: "3vh;",
  },
  red: {
    color: "rgb(233, 97, 94);",
  },
  blue: {
    color: "rgb(99, 176, 244);",
  },
  points: {
    fontWeight: "bold",
  },
}));

const join = css => Object.keys(css).filter(name => css[name]).join(" ");

const Scorecard = ({ classes, score, team, }) => {
  const css = join({
    [classes.points]: true,
    [classes.red]: team === "Red Team",
    [classes.blue]: team === "Blue Team",
  });

  return (
    <div className={css}>
      <Typography align="center" className={classes.points}>
        { score }
      </Typography>
      <Typography className={classes.points}>
        { team === "Red Team" ? "Red Team" : "Blue Team" }
      </Typography>
    </div>
  );
};

const GameNavbar = ({ state: { bluePoints, redPoints } = test }) => {
  const classes = useStyles(),
    [miniMenu, setMiniMenu] = useState(null),
    [fullMenu, setFullMenu] = useState(null),
    toggleMenu = type => ({ currentTarget }) => (
      type === "full"
        ? setFullMenu(fullMenu === null ? currentTarget : null)
        : setMiniMenu(miniMenu === null ? currentTarget : null)
    );

  return (
    <AppBar className={classes.root}>
      <Toolbar className={classes.toolbar}>
        <Grid container justify="space-between" alignItems="center">
          <Hidden mdUp>
            <Search/>
          </Hidden>
          <Hidden smDown>
            <Typography variant="h1">CLUEWORDS</Typography>
          </Hidden>
          <Grid item container direction="row" justify="center" className={classes.inset}>
            <Scorecard classes={classes} score={bluePoints} team="Blue Team"/>
            <Divider className={classes.hDivider} variant="middle"/>
            <Scorecard classes={classes} score={redPoints} team="Red Team"/>
          </Grid>
          <Hidden mdUp>
            <IconButton onClick={toggleMenu("mini")}>
              <MenuIcon/>
            </IconButton>
          </Hidden>
          <Hidden smDown>
          <Grid item container className={classes.navEnd}>
            <Button className={classes.game} variant="outlined">New Game</Button>
            <Avatar alt="Sofia" />
            <Button
              onClick={toggleMenu("full")}
              className={classes.profile}
              endIcon={<ArrowDropDown/>}>
              My Profile
            </Button>
          </Grid>
          </Hidden>
        </Grid>
        <Menu
          id="full-menu"
          anchorEl={fullMenu}
          keepMounted
          open={Boolean(fullMenu)}
          onClose={toggleMenu("full")}>
          <MenuItem onClick={toggleMenu("full")}>Profile</MenuItem>
          <MenuItem onClick={toggleMenu("full")}>Logout</MenuItem>
        </Menu>
        <Menu
          id="mini-menu"
          anchorEl={miniMenu}
          keepMounted
          open={Boolean(miniMenu)}
          onClose={toggleMenu("mini")}>
          <MenuItem onClick={toggleMenu("mini")}>New Game</MenuItem>
          <MenuItem onClick={toggleMenu("mini")}>Profile</MenuItem>
          <MenuItem onClick={toggleMenu("mini")}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

const routerWrappedGameNavbar = withRouter(GameNavbar);

export {
  routerWrappedGameNavbar as default,
  appBarHeight
};

        "status": "covered"
      }
  },
  "timer": 10
};
