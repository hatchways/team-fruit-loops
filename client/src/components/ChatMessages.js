import React, { } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography
} from "@material-ui/core";

const join = css => Object.keys(css).filter(name => css[name]).join(" ");

const ownStyle = theme => ({
  backgroundColor: "rgb(255, 62, 59)",
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  margin: theme.spacing(1),
  marginRight: theme.spacing(0),
  borderRadius: "5px",
  color: "white",
  backgroundImage: "linear-gradient(to right, rgb(255, 62, 59), rgb(254, 100, 63))",
  width: "max-content",
});

const own = theme => ({
  plain: ownStyle(theme),
  floatRight: {
    float: "right",
  },
  inline: {
    display: "inline-block",
    marginRight: theme.spacing(1),
  },
  topLeft: {
    borderTopLeftRadius: "0px",
  },
  bottomRight: {
    borderBottomRightRadius: "0px",
  },
});

const OwnMessage = withStyles(own)(({ text, classes, inline = false, direction = "bottomRight" }) => {
  const css = {
    [classes.inline]: inline,
    [classes.plain]: true,
    [classes.floatRight]: direction === "bottomRight",
    [classes.topLeft]: direction === "topLeft",
    [classes.bottomRight]: direction === "bottomRight",
  };

  return (
    <div className={join(css)}>
      { text }
    </div>
  );
});

const other = theme => ({
  label: {
    textAlign: "left",
    fontWeight: "bold",
  },
  plain: {
    backgroundColor: "rgb(229, 237, 248);",
    marginRight: theme.spacing(1),
    width: "max-content",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
});

const OtherMessage = withStyles(other)(({ classes, author, text }) => {
  return (
    <div>
      <Typography className={classes.label}>{ author }:</Typography>
      <div className={classes.plain}>{ text }</div>
    </div>
  );
});

const event = {
  label: {
    color: "rgb(153, 153, 158);",
    textAlign: "left",
    fontSize: "12",
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }
};

const EventMessage = withStyles(event)(({ classes, text, author,  }) => {
  return (
    <div className={classes.label}>{ `${author} ${text}` }</div>
  );
});

export { OwnMessage, EventMessage, OtherMessage };
