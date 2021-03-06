import React, { } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography
} from "@material-ui/core";
import PropTypes from 'prop-types';

const own = theme => ({
  plain: {
    color: "white",
    width: "max-content",
    backgroundColor: "rgb(255, 62, 59)",
    backgroundImage: "linear-gradient(to right, rgb(255, 62, 59), rgb(254, 100, 63))",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: "8px",
    marginLeft: theme.spacing(1),
  },
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

const Own = ({ classes, text, inline = false, direction = "bottomRight", }) => (
  <div className={
    Object.entries({
      [classes.inline]: inline,
      [classes.plain]: true,
      [classes.topLeft]: direction === "topLeft",
      [classes.bottomRight]: direction === "bottomRight",
      [classes.floatRight]: direction === "bottomRight",
    })
    .reduce((css, [k, v]) => (css + (v === true ? k + " " : "")), "")}>
    { text }
  </div>
);

Own.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  inline: PropTypes.bool,
  direction: PropTypes.string,
};

const other = theme => ({
  label: {
    textAlign: "left",
    fontWeight: "bold",
  },
  plain: {
    backgroundColor: "rgb(229, 237, 248);",
    marginRight: theme.spacing(1),
    width: "max-content",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: "8px",
    borderTopLeftRadius: "0px",
  },
});

const Other = ({ classes, author, text }) => (
  <div>
    <Typography className={classes.label}>{ author }:</Typography>
    <div className={classes.plain}>{ text }</div>
  </div>
);

Other.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

const event = () => ({
  label: {
    color: "rgb(153, 153, 158);",
    textAlign: "left",
    fontSize: "12",
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }
});

const Event = ({ classes, text, author, }) => (
  <div className={classes.label}>{ `${author} ${text}` }</div>
);

Event.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
};

const notification = theme => ({
  label: {
    width: "100%",
    textAlign: "center",
    fontSize: "14",
    fontWeight: "bold",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  }
});

const Notification = ({ classes, text, }) => (
  <div className={classes.label}>{ text }</div>
);

Notification.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

// Message box for Spymaster Hint
const spymasterHint = theme => ({
  plain: {
    color: "white",
    width: "max-content",
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: "8px",
    marginLeft: theme.spacing(1),
  },
  red: {
    backgroundColor: "rgb(255, 62, 59)",
    backgroundImage: "linear-gradient(to right, rgb(255, 62, 59), rgb(254, 100, 63))",
  },
  blue: {
    backgroundColor: "rgb(59, 66, 255)",
    backgroundImage: "linear-gradient(to right, rgb(59, 66, 255), rgb(95, 63, 254))",
  },
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

const SpymasterHint = ({ classes, text, inline = false, direction = "bottomRight", turn }) => (
  <div className={
    Object.entries({
      [classes.inline]: inline,
      [classes.plain]: true,
      [classes.topLeft]: direction === "topLeft",
      [classes.bottomRight]: direction === "bottomRight",
      [classes.floatRight]: direction === "bottomRight",
      [classes.red]: turn === "red",
      [classes.blue]: turn === "blue",
    })
    .reduce((css, [k, v]) => (css + (v === true ? k + " " : "")), "")}>
    { text ? text : "Submitting a hint..." }
  </div>
);

SpymasterHint.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string,
  inline: PropTypes.bool,
  direction: PropTypes.string,
};

const OwnMessage = withStyles(own)(Own),
  OtherMessage = withStyles(other)(Other),
  EventMessage = withStyles(event)(Event),
  NotificationMessage = withStyles(notification)(Notification),
  SpymasterHintMessage = withStyles(spymasterHint)(SpymasterHint);

export { OwnMessage, OtherMessage, EventMessage, NotificationMessage, SpymasterHintMessage };
