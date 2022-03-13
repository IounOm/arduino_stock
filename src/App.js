import React, { useEffect } from 'react'
import {
  BrowserRouter as Router, Route, Switch, Redirect,
} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AuthProvider } from './components/Auth'
import AuthRoute from './utils/AuthRoute'
import * as userAction from './redux/actions/user.action'

import Header from './components/Header'
import NotFoundPage from './components/NotFoundPage'

import Home from './pages/Home'
import Dashboard from './components/DashBoard'
import Loading from './components/Loading'
import Login from './components/Login'
import SignUp from './components/SignUp'
import Profile from './pages/Profile'
import GroupProject from './pages/GroupProject'
import Project from './pages/Project'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(userAction.initAuthListener())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
          <AuthRoute exact path="/home" layout={Header} component={Home} />
          <AuthRoute exact path="/login" layout={Header} component={Login} />
          <AuthRoute exact path="/signup" layout={Header} component={SignUp} />
          <AuthRoute exact path="/dashboard" layout={Header} component={Dashboard} />
          <AuthRoute exact path="/loading" layout={Header} component={Loading} />
          <AuthRoute exact path="/profile" layout={Header} component={Profile} loginRequired />
          {/* <AuthRoute exact path="/profile/:id" layout={Header} component={Profile} loginRequired /> */}
          {/* <AuthRoute exact path="/group-project" layout={Header} component={GroupProject} loginRequired /> */}
          <AuthRoute exact path="/group-project/:gid" layout={Header} component={GroupProject} loginRequired />
          <AuthRoute exact path="/group-project/:gid/project/:type/:id" layout={Header} component={Project} loginRequired />
          <AuthRoute exact path="/project" layout={Header} component={GroupProject} loginRequired />
          <AuthRoute exact path="/project/create" layout={Header} component={Project} loginRequired />
          <AuthRoute exact path="/project/:type/:id" layout={Header} component={Project} loginRequired />
          <Route path="/404" component={NotFoundPage} />
          <Redirect to="/404" />
        </Switch>
      </Router>
    </AuthProvider>
  )
}

export default App
