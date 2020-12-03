import React, { useState } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'

import Game_1 from '../assets/tutorial/Game_1.png'
import Game_2 from '../assets/tutorial/Game_2.png'
import Game_3 from '../assets/tutorial/Game_3.png'
import Game_4 from '../assets/tutorial/Game_4.png'
import Game_5 from '../assets/tutorial/Game_5.png'

import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  MobileStepper
} from '@material-ui/core'

import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons'

import PropTypes from 'prop-types'

const useStyles = makeStyles(theme => ({
  tutorialHeader: {
    textAlign: 'center'
  },
  tutorialImage: {
    width: '100%'
  }
}))

const TutorialComponent = ({ bModalOpen, handleModalClose }) => {
  const classes = useStyles()
  const theme = useTheme()

  // How to Play Modal handlers
  const [activeStep, setActiveStep] = useState(0)

  const tutorialSteps = [
    {
      title: 'Spymaster View and Turn',
      imgPath: Game_1,
      description:
        "The Spymaster provides a hint to their team's guesser(s), along with the number of words that match the hint. The number of guesses is equal to the selected number plus 1."
    },
    {
      title: 'Guesser View and Turn',
      imgPath: Game_2,
      description:
        "The Guesser tries to find their team's words based on their Spymaster's hints, while avoiding other colours."
    },
    {
      title: 'Filling the Board',
      imgPath: Game_3,
      description:
        "If all guesses are used or an incorrect word is selected, that team's turn ends, and the opposing team goes through their Spymaster to Guesser phase."
    },
    {
      title: 'Assassin Card',
      imgPath: Game_4,
      description:
        'Avoid the black card at all costs! Selecting this word automatically loses the game for your team.'
    },
    {
      title: 'Winning the Game',
      imgPath: Game_5,
      description:
        'The first team to select all of their coloured words wins the game!'
    }
  ]

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  return (
    <Dialog
      open={bModalOpen}
      onClose={() => {
        handleModalClose()
        setTimeout(() => {
          setActiveStep(0)
        }, 500)
      }}
    >
      <div>
        <DialogTitle id='how-to-play'>{'How to Play'}</DialogTitle>
        <DialogContent>
          <Typography variant='subtitle1' className={classes.tutorialHeader}>
            {tutorialSteps[activeStep].title}
          </Typography>
          <img
            className={classes.tutorialImage}
            src={tutorialSteps[activeStep].imgPath}
            alt={tutorialSteps[activeStep].title}
          />
          <Typography variant='body1'>
            {tutorialSteps[activeStep].description}
          </Typography>
          <MobileStepper
            variant='dots'
            steps={5}
            position='static'
            activeStep={activeStep}
            className={classes.root}
            nextButton={
              <Button
                size='small'
                onClick={handleNext}
                disabled={activeStep === 4}
              >
                Next
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowLeft />
                ) : (
                  <KeyboardArrowRight />
                )}
              </Button>
            }
            backButton={
              <Button
                size='small'
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                {theme.direction === 'rtl' ? (
                  <KeyboardArrowRight />
                ) : (
                  <KeyboardArrowLeft />
                )}
                Back
              </Button>
            }
          />
        </DialogContent>
      </div>
    </Dialog>
  )
}

TutorialComponent.propTypes = {
  bModalOpen: PropTypes.bool.isRequired,
  handleModalClose: PropTypes.func.isRequired
}

export default TutorialComponent
