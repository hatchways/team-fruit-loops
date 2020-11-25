import React, { useState, useLayoutEffect } from 'react'
import { MuiThemeProvider, CssBaseline } from '@material-ui/core'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import { theme } from './themes/theme'

import PrivateRoute from './components/PrivateRoute'

import Navbar from './components/Navbar'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Match from './pages/Match'
import Lobby from './pages/Lobby'
import Game from './pages/Game'

import './App.css'

import axios from 'axios'

let socket = socketIOClient()
function App () {
  const [state, setState] = useState({
    player: 'Bonnie',
    gameID: undefined,
    gameState: undefined
  })
  const [accountValues, setAccountValues] = useState({
    name: '',
    email: '',
    imageURL: ''
  })

  const withGameState = Component => props => (
    <Component
      state={state}
      setState={setState}
      socket={socket}
      accountValues={accountValues}
      {...props}
    />
  )

  useLayoutEffect(() => {
    axios
      .get('/profile')
      .then(res => {
        setAccountValues({
          name: res.data.name,
          email: res.data.email,
          imageUrl: res.data.imageUrl
        })
      })
      .catch(err => {})
  }, [])

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar state={state} accountValues={accountValues}/>
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
              />
            )}
          />
          <PrivateRoute
            path='/profile'
            component={Profile}
            accountValues={accountValues}
            setAccountValues={setAccountValues}
          />
          <Route exact path='/match' render={withGameState(Match)} />
          <Route path='/lobby/:gameID' render={withGameState(Lobby)} />
          <Route path='/game/:gameID' render={withGameState(Game)} />
        </Switch>
      </BrowserRouter>
    </MuiThemeProvider>
  )
}

export default App
