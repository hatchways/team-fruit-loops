import React from "react";
import {
  Drawer,
  Toolbar,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';

import { appBarHeight } from "../../components/Game/Nav";
import SidebarTop from "./Top";
import SidebarBottom from "./Bottom";
import SidebarChat from "./Chat";

const sidebarWidth = "20vw";

const styles = () => ({
  root: {
    alignItems: "center",
    width: sidebarWidth,
  },
  toolbar: {
    height: appBarHeight,
  },
  paper: {
    width: sidebarWidth,
  },
  sidebar: {
    height: "85vh",
  },
});

const Sidebar = ({ classes, setFinished, state, isSpy, getCurrentSpymaster, countMax, gameID, socket, player, ...topProps }) => (
  <Drawer
    variant="permanent"
    className={classes.root}
    classes={{paper: classes.paper}}>
    <Toolbar className={classes.toolbar}/>
    <div className={classes.sidebar}>
      {
        isSpy === true
          ? null
          : <SidebarTop state={state} player={state.player} getCurrentSpymaster={getCurrentSpymaster} {...topProps}/>
      }
      <SidebarChat player={state.player}/>
      <SidebarBottom setFinished={setFinished} isSpy={isSpy} countMax={countMax} gameID={gameID} player={state.player} socket={socket} getCurrentSpymaster={getCurrentSpymaster} token={topProps.token}/>
    </div>
  </Drawer>
);

const GameSidebar = withStyles(styles)(Sidebar)

GameSidebar.propTypes = {
  player: PropTypes.string.isRequired,
  state: PropTypes.object.isRequired,
  isSpy: PropTypes.bool.isRequired,
  getCurrentSpymaster: PropTypes.string.isRequired,
  countMax: PropTypes.number.isRequired,
  setFinished: PropTypes.func.isRequired,
  gameID: PropTypes.string.isRequired,
  socket: PropTypes.object.isRequired,
};

export {
  GameSidebar as default,
  sidebarWidth
};
