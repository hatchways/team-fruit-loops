import React, { forwardRef } from "react";
import { useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog, DialogTitle, DialogContent,
  Grid,
  Slide,
  Typography,
} from "@material-ui/core";
import PropTypes from 'prop-types';

import Skull from "../../assets/filename.svg";

const styles = theme => ({
  root: {
  },
  newGame: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: "rgb(38, 182, 92)",
    color: "white",
  },
  middle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    display: "inline-block",
  },
  blue: {
    color: "rgb(99, 176, 244);",
  },
  red: {
    color: "rgb(233, 97, 94);",
  },
  label: {
    display: "inline-block",
  }
});

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const FinishedComponent = ({ classes, finished, winner, bluePoints, redPoints }) => {
  const history = useHistory();
  const onNewGameClick = () => {
    history.push("/match");
  }

  return (
    <Dialog
      open={finished && winner !== undefined}
      className={classes.root}
      TransitionComponent={Transition}>
      <DialogTitle>Game Over!</DialogTitle>
      <DialogContent>
        <Grid container direction="column" alignItems="center">
          <img src={Skull} alt="Skull"/>
          <Typography
            className={Object.entries({
              [classes.red]: winner === "red",
              [classes.blue]: winner === "blue",
            })
            .reduce((css, [k, v]) => (css + (v === true ? k + " " : "")), "")}>
            { winner === "blue" ? "Blue" : "Red" } Wins
          </Typography>
          <div>
            <Typography className={[classes.blue, classes.label].join(" ")}>
              { bluePoints }
            </Typography>
            <Typography className={classes.middle}>:</Typography>
            <Typography className={[classes.red, classes.label].join(" ")}>
              { redPoints }
            </Typography>
          </div>
          <Button className={classes.newGame} onClick={onNewGameClick}>
              New Game
          </Button>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

FinishedComponent.propTypes = {
  finished: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  winner: PropTypes.string.isRequired,
  bluePoints: PropTypes.number.isRequired,
  redPoints: PropTypes.number.isRequired,
}

const Finished = withStyles(styles)(FinishedComponent);

export default Finished;
