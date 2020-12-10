import React, { useState, useLayoutEffect } from 'react'
import { MuiThemeProvider, CssBaseline, Toolbar } from '@material-ui/core'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import { theme } from './themes/theme'
import { Elements, } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios'

import PrivateRoute from './components/PrivateRoute'

import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Friends from './pages/Friends'

import Match from './pages/Match'
import Lobby from './pages/Lobby'
import Game from './pages/Game'
import Public from './pages/Public'

const stripePubKey = process.env.REACT_APP_STRIPE_PUB_KEY;
if (stripePubKey === "") {
  console.log("Warning: Stripe public key undefined");
}

let socket = socketIOClient()
function App () {
  const [state, setState] = useState({
    player: "",
    gameID: undefined,
    gameState: undefined
  })

  const [accountValues, setAccountValues] = useState({
    id: undefined,
    name: undefined,
    email: undefined,
    imageURL: undefined,
    viewedTutorial: undefined
  })

  const handleAccountValuesChange = values => {
    setAccountValues(values)
  }

  const logout = async () => {
    axios
      .get('/logout')
      .then(() => {})
      .catch(() => {})
      .finally(() => {
        handleAccountValuesChange({
          id: '',
          name: '',
          email: '',
          imageUrl: '',
          viewedTutorial: undefined
        })


      })
  }

  const withGameState = Component => props => (
    <Component
      state={state}
      setState={setState}
      socket={socket}
      accountValues={accountValues}
      logout={logout}
      {...props}
    />
  )

  useLayoutEffect(() => {
    axios
      .get('/account')
      .then(res => {
        setAccountValues({
          id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          imageUrl: res.data.imageUrl,
          viewedTutorial: res.data.viewedTutorial
        })

        setState({
          player: res.data.name,
          gameID: undefined,
          gameState: undefined
        })
      })
      .catch(() => {
        setAccountValues({
          id: '',
          name: '',
          email: '',
          imageUrl: '',
          viewedTutorial: undefined
        })
      })
  }, [])

  return (
    <MuiThemeProvider theme={theme}>
      <Elements stripe={loadStripe(stripePubKey)}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar
            state={state}
            accountValues={accountValues}
            logout={logout}
            handleAccountValuesChange={handleAccountValuesChange}
          />
          <Toolbar />
          <Switch>
            <Redirect exact from='/' to='/signup' />
            {!accountValues.id || accountValues.id === '' ? (
              <Route
                path='/signup'
                render={props => (
                  <Signup {...props} accountValues={accountValues} />
                )}
              />
            ) : (
              <Redirect from='/signup' to='/match' />
            )}
            {!accountValues.id || accountValues.id === '' ? (
              <Route
                path='/login'
                render={props => (
                  <Login
                    {...props}
                    accountValues={accountValues}
                    handleAccountValueChange={handleAccountValuesChange}
                  />
                )}
              />
            ) : (
              <Redirect from='/login' to='/match' />
            )}

            <PrivateRoute
              path='/profile'
              component={Profile}
              accountValues={accountValues}
              setAccountValues={setAccountValues}
              handleAccountValuesChange={handleAccountValuesChange}
            />
            <PrivateRoute
              path='/friends'
              component={Friends}
              accountValues={accountValues}
            />
            <PrivateRoute exact path='/match' component={withGameState(Match)} />
            <PrivateRoute
              exact
              path='/public'
              component={withGameState(Public)}
            />
            <PrivateRoute
              path='/lobby/:gameID'
              component={withGameState(Lobby)}
            />
            <PrivateRoute path='/game/:gameID' component={withGameState(Game)} />
          </Switch>
        </BrowserRouter>
      </Elements>
    </MuiThemeProvider>
  )
}

export default App
