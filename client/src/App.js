import React, { useState, useLayoutEffect } from 'react'
import { MuiThemeProvider, CssBaseline, Toolbar } from '@material-ui/core'
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import { theme } from './themes/theme'

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

import axios from 'axios'

let socket = socketIOClient()
function App () {
  const [state, setState] = useState({
    player: 'Bonnie',
    gameID: undefined,
    gameState: undefined
  })

  const [accountValues, setAccountValues] = useState({
    id: '',
    name: '',
    email: '',
    imageURL: '',
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
          imageURL: ''
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
      .catch(() => {})
  }, [])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar state={state} accountValues={accountValues} logout={logout} />
        <Toolbar />
        <Switch>
          <Redirect exact from='/' to='/signup' />
          <Route path='/signup' render={props => <Signup {...props} />} />
          <Route
            path='/login'
            render={props => (
              <Login
                {...props}
                accountValues={accountValues}
                setAccountValues={setAccountValues}
                handleAccountValueChange={handleAccountValuesChange}
              />
            )}
          />
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
          <Route exact path='/match' render={withGameState(Match)} />
          <Route exact path='/public' render={withGameState(Public)} />
          <Route path='/lobby/:gameID' render={withGameState(Lobby)} />
          <Route path='/game/:gameID' render={withGameState(Game)} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  )
}

export default App
