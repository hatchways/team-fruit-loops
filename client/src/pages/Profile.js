import React, { useState, useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types';
import axios from 'axios'

import { Button, TextField, Typography, Container } from '@material-ui/core'

import EditIcon from '@material-ui/icons/Edit'
import SendIcon from '@material-ui/icons/Send'

import UploadImage from '../components/Profile/uploadImage'
import {
  Upgrade,
  UpgradeButton,
  useFetchPaymentIntent,
} from '../components/Profile/Upgrade'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '10px',
    boxShadow: '0 0 5px 0',
    padding: theme.spacing(3, 5),
    backgroundColor: 'white'
  },
  underline: {
    width: '50px',
    height: '4px',
    color: '#32BE72',
    backgroundColor: '#32BE72'
  },
  form: {
    marginTop: theme.spacing(1),
    width: '100%'
  },
  editButton: {
    minWidth: '40px',
    maxWidth: '40px'
  },
  upgradeButton: {
    marginTop: theme.spacing(6),
  },
}))

const Profile = ({ accountValues, handleAccountValuesChange }) => {
  const classes = useStyles()
  let textInput = useRef(null)

  const [values, setValues] = useState({
    id: '',
    name: '',
    email: '',
    imageUrl: ''
  })

  // Save default name in separate variable, as the values["name"] variable can be dynamically edited
  const [savedName, setSavedName] = useState('')

  // Handle disabling of name field
  const [editState, setEditState] = useState(false)

  const editName = () => {
    // Button is pressed while editing name field
    if (editState) {
      handleSubmitName()
    } else {
      // Button is pressed while name field is disabled
      setTimeout(() => {
        textInput.current.focus()
      }, 100)
    }

    setEditState(!editState)
  }

  const handleKeyPress = e => {
    if (e.key === 'Escape') {
      setEditState(false)
      setValues({
        id: values['id'],
        name: savedName,
        email: values['email'],
        imageUrl: values['imageUrl']
      })
    } else if (e.key === 'Enter' || e.key === 'NumpadEnter') {
      setEditState(false)
      handleSubmitName()
    }
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({ ...values, [name]: value })
  }

  const handleSubmitName = e => {
    if (savedName !== values['name']) {
      axios
        .post('/account/update', values)
        .then(res => {
          handleAccountValuesChange({
            id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            imageUrl: res.data.imageUrl,
            viewedTutorial: res.data.viewedTutorial,
          })
          setSavedName(values['name'])
        })
        .catch(() => {})
    }
  }

  useEffect(() => {
    // Populate the profile fields with account values stored in App.js
    setValues(accountValues)
    // Specifically set saved name with account values name for preservation
    setSavedName(accountValues.name)
  }, [accountValues])

  const [upgradeToggle, setUpgradeToggle] = useState(false);
  const upgradeClose = () => setUpgradeToggle(old => !old);
  const {
    view = "loading",
    intent = "",
    text = "",
    transitionPaid,
    transitionError,
  } = useFetchPaymentIntent(accountValues.name);

  const onSuccess = () => {
    if (transitionPaid) {
      transitionPaid();
    }
  }

  const onError = () => {
    if (transitionError) {
      transitionError();
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Upgrade
        intent={intent}
        open={upgradeToggle}
        close={upgradeClose}
        onError={onError}
        onSuccess={onSuccess}
      />
      <div className={classes.root}>
        <>
          {values['email'] !== '' ? (
            <>
              <Typography variant='h5'>Profile</Typography>
              <hr className={classes.underline} />
              <form className={classes.form}>
                <Typography variant='subtitle1'>Name:</Typography>
                <TextField
                  id='name'
                  name='name'
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  value={values['name']}
                  inputRef={textInput}
                  disabled={!editState}
                  onKeyDown={handleKeyPress}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <Button
                        variant='contained'
                        color='primary'
                        className={classes.editButton}
                        onClick={editName}
                      >
                        {editState ? <SendIcon /> : <EditIcon />}
                      </Button>
                    )
                  }}
                />

                <Typography variant='subtitle1'>Email:</Typography>
                <TextField
                  variant='outlined'
                  margin='normal'
                  fullWidth
                  value={values['email']}
                  disabled
                />
                <Typography variant='subtitle1'>Profile Picture:</Typography>
                <UploadImage
                  accountValues={accountValues}
                  handleAccountValuesChange={handleAccountValuesChange}
                />
                <Container className={classes.upgradeButton} align="center">
                  <UpgradeButton
                    text={text}
                    view={view}
                    upgradeClose={upgradeClose}/>
                </Container>
              </form>{' '}
              <br />
            </>
          ) : (
            <></>
          )}
        </>
      </div>
    </Container>
  )
}

Profile.propTypes = {
  accountValues: PropTypes.object.isRequired,
  handleAccountValuesChange: PropTypes.func.isRequired,
};

export default Profile
