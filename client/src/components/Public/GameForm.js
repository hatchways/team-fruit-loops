import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  public: {
    display: 'block',
    margin: 'auto',
    marginTop: theme.spacing(1),
    width: "50%",
    fontWeight: "bold",
  },
  title: {
    textAlign: 'center'
  }
}));

const Btn = ({ on, css, text }) => (
  <Button onClick={on} className={css} variant="outlined">{ text }</Button>
);

const GameForm = ({ onCreateGame, playerName, setPlayerName, accountValues }) => {
  const classes = useStyles()
  const [gameRoomName, setGameRoomName] = useState(`${playerName}'s game`);
  const [playerNum, setPlayerNum] = useState(4);

  const selectItems = [];
  for (let i = 4; i <= 8; i++) {
    selectItems.push(<option key={i}>{i}</option>);
  }

  const onGameNameChange = (e) => {
    if (e.target.value.trim() === '')
      setGameRoomName(playerName + '\'s game');
    else
      setGameRoomName(e.target.value.trim());
  }

  const onPlayerNumberChange = (e) => {
    setPlayerNum(e.target.value);
  }

  useEffect(() => {
    if (accountValues.name) {
      setGameRoomName(accountValues.name + '\'s game')
    }
  }, [accountValues.name])

  return (
    <div>
      <h1 className={classes.title}>Create a public game</h1>
      <form className={classes.form} noValidate autoComplete='off'>
        <TextField id='gameName' label='Game name' variant='outlined' value={gameRoomName} onChange={onGameNameChange}/>
        <TextField
          id='playerNumber'
          select
          label='Max player number'
          value={playerNum}
          onChange={onPlayerNumberChange}
          SelectProps={{
            native: true,
          }}
          variant='outlined'
        >
          {selectItems}
        </TextField>
        <Btn on={() => onCreateGame(playerNum)} css={classes.public} text="Create public game"/>
      </form>
    </div>
  );
}

export default GameForm;
