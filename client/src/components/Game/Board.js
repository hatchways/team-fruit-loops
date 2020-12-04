import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Redirect } from 'react-router-dom'
import { Grid, Button, Container } from '@material-ui/core'
import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  card: props => ({
    height: '100%',
    width: '100%',
    borderRadius: 10,
    boxShadow: '0 3px 5px 2px rgba(149, 144, 144, .1)',
    textTransform: 'capitalize',
    'text-align': 'center',
    whiteSpace: 'nowrap',
    background:
      props.status === 'covered'
        ? 'white'
        : props.status === 'black'
        ? 'linear-gradient(to right, rgb(0, 0, 0), rgb(138, 138, 138))'
        : props.status === 'red'
        ? 'linear-gradient(to right, rgb(255, 0, 0), rgb(220, 20, 60))'
        : props.status === 'blue'
        ? 'linear-gradient(to right, rgb(0, 0, 255), rgb(30, 144, 255))'
        : 'linear-gradient(to right, rgb(128, 128, 128), rgb(192, 192, 192))',
    color:
      props.status !== 'covered'
        ? 'white'
        : props.color === undefined
        ? 'black'
        : props.color,
    cursor:
      isSpy(props.getRole) || isSpectator(props.getRole)
        ? 'default'
        : 'pointer',
    '&:hover': {
      boxShadow:
        props.status === 'covered' ? '0 3px 5px 2px rgba(0, 0, 0, .3)' : null,
      backgroundColor: props.status === 'covered' ? 'white' : props.status
    }
  }),
  board: {
    margin: 'auto',
    padding: '10px',
    height: '75vh',
    width: '100vw'
  },
  grid: {
    height: '100%',
    width: '100%'
  },
  prompt: {
    display: 'flex'
  },
  promptContent: props => ({
    color: props.promptColor,
    margin: 'auto',
    'text-align': 'center',
    '&:first-letter': {
      'text-transform': 'capitalize'
    }
  }),
  timer: props => ({
    color: props.timerColor,
    'text-align': 'right',
  }),
  paper: {
    padding: '5px',
    margin: '10px'
  }
}))

const isSpy = role => role === 'blue spy' || role === 'red spy'
const isSpectator = role => role === 'spectator'

const Prompt = ({ state, timer, getRole }) => {
  let prompt
  const { gameState } = state
  const { turn, hint } = gameState
  const [team, teamRole] = getRole.split(' ')
  const timerColor = timer < 10 ? 'red' : 'black'
  const classes = useStyles({ promptColor: team, timerColor: timerColor })

  switch (true) {
    case team !== turn:
      prompt = `${turn} team's turn`
      break
    case (hint === undefined && teamRole === 'spy') ||
      (hint !== undefined && teamRole === 'guesser'):
      prompt = 'Your turn'
      break
    case hint === undefined && teamRole !== 'spy':
      prompt = "Waiting for spymaster's hint"
      break
    case hint !== undefined && teamRole === 'spy':
      prompt = 'Waiting for guesser(s)'
      break
    default:
      prompt = "error";
  }

  return (
    <Container className={classes.prompt} spacing={3}>
      <div>
        <h2>Role: {getRole}</h2>
        <h2>Reamining guesses: {gameState.guessNum}</h2>
      </div>
      <h1 className={classes.promptContent}>{prompt}</h1>
      <h2 className={classes.timer}>{timer}</h2>
    </Container>
  )
}

const Card = ({ status, color, word, onClick, getRole }) => {
  const classes = useStyles({
    status: status,
    color: color,
    getRole: getRole
  })
  const click = word => e => {
    e.preventDefault()
    onClick(word)
  }
  return (
    <Button className={classes.card} disableRipple={true} onClick={click(word)}>
      {word}
    </Button>
  )
}

const Board = ({ state, timer, onNextMove, getRole }) => {
  const classes = useStyles()
  const { gameState } = state
  if (gameState === undefined) {
    return <Redirect to={'/match'} />
  }

  let { cards, boardState } = gameState

  // create an array for rendering board
  const words = Object.keys(boardState).map(key => {
    return {
      word: key,
      status: boardState[key].status,
      color: isSpy(getRole) || isSpectator(getRole) ? cards[key] : undefined
    }
  })
  const wordsGrid = []
  while (words.length) wordsGrid.push(words.splice(0, 5))

  return (
    <div className={classes.board}>
      <Prompt state={state} timer={timer} getRole={getRole} />
      <Grid container spacing={3} justify='center' className={classes.grid}>
        {wordsGrid.map((row, rowIndex) => (
          <Grid
            container
            item
            key={rowIndex}
            xs={12}
            spacing={3}
            justify='center'
          >
            {row.map((value, index) => (
              <Grid item key={index} xs={2}>
                <Card
                  word={value.word}
                  color={value.color}
                  status={value.status}
                  onClick={onNextMove}
                  getRole={getRole}
                />
              </Grid>
            ))}
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

Prompt.propTypes = {
  state: PropTypes.object.isRequired,
  timer: PropTypes.number.isRequired,
  getRole: PropTypes.string.isRequired
}

Card.propTypes = {
  status: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  word: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  getRole: PropTypes.string.isRequired
}

Board.propTypes = {
  state: PropTypes.object.isRequired,
  timer: PropTypes.number.isRequired,
  onNextMove: PropTypes.func.isRequired,
  getRole: PropTypes.string.isRequired
}

export default Board
