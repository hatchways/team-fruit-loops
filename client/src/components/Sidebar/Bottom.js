import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Chip,
  Divider,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import PropTypes from 'prop-types';

const useSpyBottomStyles = makeStyles(theme => ({
  bottom: {
    width: "100%",
    height: "auto",
    marginTop: theme.spacing(1),
  },
  done: {
    marginTop: theme.spacing(1),
    display: "block",
    backgroundColor: "rgb(38, 182, 92)",
    color: "white",
    width: "50%",
  },
  text: {
    width: "100%",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  chip: {
    borderRadius: "8px",
    display: "inline-block",
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
    paddingTop: "3px;",
    color: "rgb(183, 183, 183);",
  },
  count: {
  },
  prompt: {
    backgroundColor: "rgb(75, 75, 75);",
    color: "white",
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    borderRadius: "8px",
  },
  triangle: {
    content: ' ',
    width: theme.spacing(0),
    height: theme.spacing(0),
    border: theme.spacing(0),
    borderLeft: `${theme.spacing(1)}px solid transparent;`,
    borderRight: `${theme.spacing(1)}px solid transparent;`,
    borderTop: `${theme.spacing(1)}px solid rgb(75, 75, 75);`,
  },
  hDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
    height: "1px;",
  }
}));

const SpyBottom = ({ countMax, setFinished, }) => {
  const classes = useSpyBottomStyles();
  const [message, setMessage] = useState("");
  const [count, setCount] = useState(0);
  const onClickDone = () => setFinished(true);
  const onClickMin = () => setCount(Math.max(count - 1, 0));
  const onClickMax = () => setCount(Math.min(count + 1, countMax));

  return (
    <Grid container justify="center" className={classes.bottom}>
      <Grid container item xs={12}
        direction="column"
        alignContent="center"
        alignItems="center"
        align="center">
        <div className={classes.prompt}>Make your move!</div>
        <div className={classes.triangle}></div>
      </Grid>
      <Divider className={classes.hDivider}/>
      <Grid item xs={12} md={8}>
        <TextField
          multiline
          value={message}
          onChange={({ target: { value }}) => setMessage(value)}
          className={classes.text}
          placeholder="Type here..."/>
      </Grid>
      <Grid container item justify="center" xs={12} md={4}>
        <Chip
          variant="outlined"
          size="small"
          className={classes.chip}
          onClick={onClickMin}
          label="-"/>
        <Typography className={classes.count}>{ count }</Typography>
        <Chip
          variant="outlined"
          size="small"
          className={classes.chip}
          onClick={onClickMax}
          label="+"/>
      </Grid>
      <Button
        onClick={onClickDone}
        className={classes.done}
        variant="outlined">
        Done
      </Button>
    </Grid>
  );
};

SpyBottom.propTypes = {
  countMax: PropTypes.number.isRequired,
  setFinished: PropTypes.func.isRequired,
};

const useStyles = makeStyles(theme => ({
  bottom: {},
  hDivider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
    height: "1px;",
  },
  text: {
    width: "100%",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

const SidebarBottom = ({ setFinished, isSpy, countMax, }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");

  if (isSpy) {
    return <SpyBottom setFinished={setFinished} countMax={countMax} />;
  }

  return (
    <div className={classes.bottom}>
      <Divider className={classes.hDivider}/>
        <TextField
          multiline
          value={message}
          onChange={({ target: { value }}) => setMessage(value)}
          className={classes.text}
          placeholder="Type here..."/>
    </div>
  );
};

SidebarBottom.propTypes = {
  isSpy: PropTypes.bool.isRequired,
  countMax: PropTypes.number.isRequired,
  setFinished: PropTypes.func.isRequired,
};

export default SidebarBottom;
