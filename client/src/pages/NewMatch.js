import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Container, Card, CardHeader, CardContent, Divider,
  Grid, Typography, Box, Button, TextField,
} from '@material-ui/core';

const styles = theme => ({
  centered: {
    textAlign: "center",
  },
  vert: {
    height: "60%",
  },
  divider: {
    height: "1px",
    backgroundColor: "rgb(72, 172, 122)",
    border: "none",
    marginLeft: "47%",
    marginRight: "47%",
  },
  join: {
    width: "51%",
  },
  or: {
    textAlign: "center",
    width: "100%",
  },
  centerBtn: {
    display: "flex",
    justifyContent: "center",
  },
  gameBtn: {
    display: "flex",
    flexDirection: "column",
  },
  vertDiv: {
    width: "1px",
    height: "40vh",
  }
});

const GameIDInput = withStyles(styles)(({ classes }) => {
  return (
    <Grid container className={classes.centerBtn} xs={12}>
      <form>
        <TextField
          placeholder="Enter Game ID"
          InputProps={{
            endAdornment: (
              <Button className={classes.join} variant="outlined">Join Game</Button>
            )
          }}>
        </TextField>
      </form>
    </Grid>
  );
});

const JoinGame = withStyles(styles)(({ classes }) => {
  return (
    <Grid container item xs={8}>
      <Grid item xs={12}>
        <Typography component="h1">
          <Box fontWeight="fontWeightBold">
            Join a Game:
          </Box>
        </Typography>
      </Grid>
      <GameIDInput/>
      <Grid container xs={12}>
        <Grid item xs={12}>
          <Typography component="h1">
            <Box fontWeight="fontWeightBold" className={classes.or}>Or</Box>
          </Typography>
        </Grid>
      </Grid>
      <Grid container xs={12} className={classes.centerBtn}>
        <Grid item xs={6} className={classes.centerBtn}>
          <Button variant="outlined">Join Random</Button>
        </Grid>
      </Grid>
    </Grid>
  );
});

const NewGame = withStyles(styles)(({ classes }) => {
  return (
    <Grid item xs={3}>
      <Container>
        <Typography component="h1">
          <Box fontWeight="fontWeightBold">
            New Game:
          </Box>
        </Typography>
        <div className={classes.gameBtn}>
          <div>
            <Button variant="outlined">Public</Button>
          </div>
          <div>
            <Button variant="outlined">Private</Button>
          </div>
        </div>
      </Container>
    </Grid>
  );
});

const Content = withStyles(styles)(({ classes }) => {
  return (
    <CardContent>
      <Container>
        <Grid container spacing={1}>
          <JoinGame/>
          <Grid item xs={1}>
            <Container>
              <Divider orientation="vertical" className={classes.vertDiv} flexItem />
            </Container>
          </Grid>
          <NewGame/>
        </Grid>
      </Container>
    </CardContent>
  );
});

const NewMatch = withStyles(styles)(({ classes }) => {
  return (
    <Container>
      <Card>
        <CardHeader className={classes.centered} title="Welcome"/>
        <Divider className={classes.divider} variant="middle"/>
        <Content/>
      </Card>
    </Container>
  );
});

export default NewMatch;
