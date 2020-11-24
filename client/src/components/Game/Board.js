import React from "react";
import {
  Grid,
  Paper,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";


const cardStyles = theme => ({
  card: {
    textAlign: "center",
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0),
  },
  paper: {
    width: "100%",
    textAlign: 'center',
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
});

const Card = ({ classes, key }) => (
  <Grid item container xs key={key} className={classes.card}>
    <Paper className={classes.paper}>
        key{key}
    </Paper>
  </Grid>
);

const GameCard = withStyles(cardStyles)(Card);

export default GameCard;
