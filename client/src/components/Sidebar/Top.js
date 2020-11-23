import React from "react";
import {
  Divider,
  Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from 'prop-types';

import { OwnMessage, } from "./Messages";

const styles = theme => ({
  topper: {
   paddingTop: theme.spacing(1),
  },
  top: {
   paddingTop: theme.spacing(1),
   marginBottom: theme.spacing(1),
  },
  bottom: {
   paddingBottom: theme.spacing(1),
  },
  label: {
    fontWeight: "bold",
    marginLeft: theme.spacing(1),
  },
  inline: {
    display: "inline-block",
  },
  hDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
});

const Top = ({ classes, player, token, count, }) => (
  <div className={classes.topper}>
    <Typography align="left" className={[classes.label, classes.top].join(" ")}>
        { player } (spymaster):
    </Typography>
    <OwnMessage text={token} direction="topLeft" inline={true}/>
    <Typography
      className={[classes.label, classes.inline, classes.bottom].join(" ")}>
      x { `${count}` }
    </Typography>
    <Divider className={classes.hDivider}/>
  </div>
);

Top.propTypes = {
  classes: PropTypes.object.isRequired,
  player: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
};

const SidebarTop = withStyles(styles)(Top);

export default SidebarTop;
