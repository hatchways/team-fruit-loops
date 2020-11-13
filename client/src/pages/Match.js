import React, { useState }from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  Container, Card, CardContent, Divider,
  Grid, Typography, Button, TextField,
} from '@material-ui/core';

const styles = theme => ({
  header: {
    textAlign: "center",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(0),
  },
  card: {
    marginTop: theme.spacing(3),
  },
  hDivider: {
    height: "1px",
    backgroundColor: "rgb(72, 172, 122)",
    marginLeft: theme.spacing(33),
    marginRight: theme.spacing(33),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  vDivider: {
    width: "1px",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
  },
  join: {
    textAlign: "left",
    marginLeft: theme.spacing(3),
    fontWeight: "bold",
  },
  game: {
    whiteSpace: "nowrap",
    backgroundColor: "rgb(75, 75, 75)",
    width: "100%",
    color: "white",
  },
  random: {
    whiteSpace: "nowrap",
    backgroundColor: "rgb(75, 75, 75)",
    color: "white",
    width: "50%",
  },
  new: {
    fontWeight: "bold",
    height: theme.spacing(0),
  },
  form: {
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(5),
  },
  or: {
    fontWeight: "bold",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  public: {
    marginTop: theme.spacing(1),
  },
  private: {
    marginTop: theme.spacing(1),
  },
});

const join = (id, type) => e => {
  switch (type) {
  case "join":
    console.log("join: ", id);
    break;
  case "random":
    console.log("random");
    break;
  case "public":
    console.log("public");
    break;
  case "private":
    console.log("private");
    break;
  default:
    console.log("unknown case: ", type);
  }
};

const Match = withStyles(styles)(({ classes }) => {
  const [id, setID] = useState("");

  return (
    <Container>
       <Card className={classes.card}>
         <CardContent>
            <Typography variant="h3" className={classes.header}>
              Welcome
            </Typography>
            <Divider className={classes.hDivider} variant="middle"/>
            <Grid container align="center">
              <Grid item xs={8}>
                <Typography variant="h6" className={classes.join}>
                  Join a Game:
                </Typography>
                <form className={classes.form}>
                  <TextField
                    fullWidth
                    onChange={({ target: { value }}) => setID(value)}
                    variant="outlined"
                    className={classes.text}
                    placeholder="Enter Game ID"
                    InputProps={{
                      endAdornment: (
                        <Button
                          onClick={join(id, "join")}
                          className={classes.game}
                          variant="outlined">
                          Join Game
                        </Button>
                      )
                    }}>
                  </TextField>
                </form>
                <Typography variant="h6" className={classes.or}>
                  Or
                </Typography>
                <Button
                  onClick={join(id, "random")}
                  className={classes.random}
                  variant="outlined">
                  Join Random
                </Button>
              </Grid>
              <Grid item xs={1}>
                <Divider orientation="vertical" className={classes.vDivider}/>
              </Grid>
              <Grid item container xs={3}>
                <Typography variant="h6" className={classes.new}>
                  New Game:
                </Typography>
                <Grid item container direction="column" xs={6}>
                  <Button
                    onClick={join(id, "public")}
                    className={classes.public}
                    variant="outlined">
                    Public
                  </Button>
                  <Button
                    onClick={join(id, "private")}
                    className={classes.private}
                    variant="outlined">
                    Private
                  </Button>
                </Grid>
              </Grid>
            </Grid>
         </CardContent>
       </Card>
    </Container>
  );
});

export default Match;
