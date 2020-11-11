import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Container,
  Grid,
  Card, CardHeader,
  Divider,
  Typography,
  Button,
} from '@material-ui/core';
import { AddCircle, Check, HighlightOffSharp, Link, } from '@material-ui/icons';

const styles = theme => ({
  header: {
    textAlign: "center",
  },
  divider: {
    height: "1px",
    backgroundColor: "rgb(72, 172, 122)",
    border: "none",
    marginLeft: "47%",
    marginRight: "47%",
  },
  vertDiv: {
    width: "1px",
    height: "40vh",
  }
});

const Roles = withStyles(styles)(({ classes }) => {
  return (
    <Grid container>
      <Grid item xs={12} align="center">
        Red Field Agent<AddCircle/>
      </Grid>
      <Grid item xs={12} align="center">
        Blue Spy Master<AddCircle/>
      </Grid>
      <Grid item xs={12} align="center">
        Blue Field Agent<AddCircle/>
      </Grid>
    </Grid>
  );
});

const Players = withStyles(styles)(({ classes }) => {
  return (
    <Grid container>
      <Grid item xs={12} align="center">
        <Check/> Bonnie - Red Spy Master (You) <HighlightOffSharp/>
      </Grid>
    </Grid>
  );
});

const Game = withStyles(styles)(({ classes }) => {
  return (
    <Container>
      <Card>
        <CardHeader className={classes.header} title="New Game"/>
        <Divider className={classes.divider} variant="middle"/>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography align="center" variant="h6">Available roles</Typography>
            <Roles/>
          </Grid>
          <Grid item container xs={12} align="center" direction="row">
            <Grid item xs={8}>
              <Typography>Players ready for match:</Typography>
              <Players/>
            </Grid>
            <Grid item xs={1}>
              <Divider orientation="vertical" className={classes.vertDiv}/>
            </Grid>
            <Grid item align="center" xs={3}>
              <Typography>Share match id:</Typography>
              <Button startIcon={<Link/>}>Copy</Button>
            </Grid>
          </Grid>
          <Grid item xs={12} align="center">
            <Button variant="outlined" >Start Match</Button>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
});

export default Game;
