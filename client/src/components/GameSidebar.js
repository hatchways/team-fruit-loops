import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Chip,
  Divider,
  Drawer,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";

import { OwnMessage, } from "../components/ChatMessages";
import GameSidebarChat from "../components/GameSidebarChat";

const sidebarWidth = "25vw";

const top = theme => ({
  top: {
    marginTop: theme.spacing(3),
  },
  bottom: {
    marginBottom: theme.spacing(3),
  },
  label: {
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
  },
  inline: {
    display: "inline-block",
  },
  topper: {
    height: "15%",
    marginBottom: theme.spacing(5),
    marginTop: theme.spacing(4),
  },
});

const SidebarTop = withStyles(top)(({ player = "sofia", token = "Animals", count = "4", classes }) => {
  return (
    <div className={classes.topper}>
      <Typography align="left" className={[classes.label, classes.top].join(" ")}>
          { player } (spymaster):
      </Typography>
      <OwnMessage text={token} direction="topLeft" inline={true}/>
      <Typography
        className={[classes.label, classes.inline, classes.bottom].join(" ")}>
        x { `${count}` }
      </Typography>
      <Divider/>
    </div>
  );
});

const stepper = theme => ({
  count: {
    marginLeft: "1vw",
    marginRight: "1vw",
  },
  text: {
    marginLeft: theme.spacing(1),
    minWidth: "45%",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    borderRadius: "5px",
  },
  wordStep: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  chip: {
    borderRadius: "5px",
  }
});

const WordStep = withStyles(stepper)(({ classes }) => {
  const [count, setCount] = useState(0),
    [message, setMessage] = useState("");

  return (
    <div className={classes.wordStep}>
      <TextField
        value={message}
        onChange={({ target: { value }}) => setMessage(value)}
        className={classes.text}
        placeholder="Type here..."/>
      <div className={classes.controls}>
        <Chip
          variant="outlined"
          size="small"
          className={classes.chip}
          onClick={() => setCount(count - 1)} label="-"/>
        <Typography className={classes.count}>{ count }</Typography>
        <Chip
          variant="outlined"
          size="small"
          className={classes.chip}
          onClick={() => setCount(count + 1)} label="+"/>
      </div>
    </div>
  );
});

const bottom = theme => ({
  floatLeft: {
    float: "left",
  },
  anchor: {
    width: sidebarWidth,
    height: "15%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  done: {
    display: "block",
    backgroundColor: "rgb(38, 182, 92)",
    color: "white",
    width: "50%",
    marginLeft: "25%",
  },
});

const SidebarBottom = withStyles(bottom)(({ classes, isSpy }) => {
  if (isSpy) {
    const [count, setCount] = useState(0);

    return (
      <div className={classes.anchor}>
        <div className={classes.floatLeft}>
          <WordStep count={count} setCount={setCount}/>
        </div>
        <div>
          <Button className={classes.done} variant="outlined">Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.anchor}></div>
  );
});

const styles = theme => ({
  sidebar: {
    backgroundColor: "blue",
    width: sidebarWidth,
    flexShrink: 0,
    overflowY: "clip",
  },
  paper: {
    width: sidebarWidth,
  },
  container: {
    minHeight: "75%",
    maxHeight: "85%",
  },
});

const GameSidebar = withStyles(styles)(({ classes, state, isSpy }) => {
  return (
    <Drawer
      variant="permanent"
      className={classes.sidebar}
      classes={{paper: classes.paper}}>
      <Toolbar/>
      <div className={classes.container}>
        { isSpy && <SidebarTop state={state}/> }
        <GameSidebarChat/>
        <Divider/>
        <SidebarBottom isSpy={isSpy}/>
      </div>
    </Drawer>
  );
});

export { GameSidebar as default, sidebarWidth };
